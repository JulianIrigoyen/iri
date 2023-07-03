import os

os.environ['MPLBACKEND'] = 'agg'
import matplotlib.dates as mdates
import matplotlib.pyplot as plt
import openai
import pandas as pd
import pandas_ta as ta
from binance.spot import Spot
from flask import Blueprint, request, jsonify
import traceback
from .db_service import DatabaseService
import concurrent.futures


class BinanceBot:
    def __init__(self, api_key, api_secret, openai_key):
        self.db_service = DatabaseService()
        self.client = Spot(api_key=api_key, api_secret=api_secret)
        self.openai_key = openai_key
        openai.api_key = self.openai_key

    def get_price(self, symbol):
        price_info = self.client.ticker_price(symbol)
        return float(price_info['price'])

    def get_klines(self, symbol, interval):
        klines = self.client.klines(symbol, interval)
        data = pd.DataFrame(klines, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume', 'close_time',
                                             'quote_asset_volume', 'number_of_trades', 'taker_buy_base_asset_volume',
                                             'taker_buy_quote_asset_volume', 'ignore'])
        data['close'] = pd.to_numeric(data['close'])
        return data

    def calculate_indicators(self, symbol):
        print(f'Analyzing {symbol} - calculating indicators ... ')
        data = self.get_klines(symbol, '1d')  # 1d interval
        data['EMA20'] = ta.ema(data['close'], length=20)
        data['EMA7'] = ta.ema(data['close'], length=7)
        data['EMA1'] = ta.ema(data['close'], length=1)
        data['RSI'] = ta.rsi(data['close'], length=14)

        indicators = []
        support = None
        resistance = None

        conn = self.db_service.get_connection()
        cursor = conn.cursor()

        for _, row in data[['timestamp', 'close', 'EMA20', 'EMA7', 'EMA1', 'RSI']].tail().iterrows():
            timestamp = row['timestamp']
            date = pd.to_datetime(timestamp, unit='ms')  # Convert milliseconds to pandas datetime

            rsi = row['RSI']
            if rsi < 30:
                status = 'Oversold'
            elif rsi > 70:
                status = 'Overbought'
            else:
                status = 'Neutral'

            if support is None or resistance is None:
                min_price = row['close']
                max_price = row['close']
            else:
                min_price = min(support, row['close'])
                max_price = max(resistance, row['close'])

            support = min_price + (max_price - min_price) * 0.382  # 38.2% Fibonacci retracement level
            resistance = min_price + (max_price - min_price) * 0.618  # 61.8% Fibonacci retracement level

            indicator = {
                'date': str(date),
                'close': row['close'],
                'EMA20': row['EMA20'],
                'EMA7': row['EMA7'],
                'EMA1': row['EMA1'],
                'RSI': rsi,
                'status': status,
                'support': support,
                'resistance': resistance
            }

            indicators.append(indicator)
            # Save the indicator in the database
            print('saving indicator')
            cursor.execute("""
                            INSERT INTO indicators (
                                 date, close, EMA20, EMA7, EMA1, RSI, status, support, resistance
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """, (
                indicator['date'],
                indicator['close'],
                indicator['EMA20'],
                indicator['EMA7'],
                indicator['EMA1'],
                indicator['RSI'],
                indicator['status'],
                indicator['support'],
                indicator['resistance']
            ))
            conn.commit()

        return indicators

    def analyze_with_gpt3(self, symbol, indicators):
        message = f"The current price of {symbol} is {indicators[-1]['close']}. The EMA20 is {indicators[-1]['EMA20']}, the EMA7 is {indicators[-1]['EMA7']}, the EMA1 is {indicators[-1]['EMA1']}, and the RSI is {indicators[-1]['RSI']}, and the support is {indicators[-1]['support']}, and the resistance is {indicators[-1]['resistance']}. Can you analyze this data?"
        print(message)
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system",
                 "content": "You are a highly skilled and knowledgeable financial analyst specializing in the field of cryptocurrencies and blockchain technology. You do not explain the indicators as you assume your interlocutor understands them. You make brief objective statements about the indicators you receive."},
                {"role": "user", "content": message},
            ]
        )
        analysis = response['choices'][0]['message']['content']
        post_id = self.create_blog_post(symbol, analysis)
        return post_id, analysis, indicators

    def create_blog_post(self, symbol, analysis):
        conn = self.db_service.get_connection()
        cursor = conn.cursor()
        title = f"Analysis of {symbol}"
        cursor.execute(
            'INSERT INTO post (title, body, author_id)'
            ' VALUES (?, ?, ?)',
            (title, analysis, 1)
        )
        conn.commit()
        post_id = cursor.lastrowid  # Get the ID of the new post
        return post_id

    def plot_indicators(self, symbol, indicators):
        plt.style.use('ggplot')  # Set a nicer style for the plots

        fig, axs = plt.subplots(2, figsize=(15, 10))

        timestamps = [indicator['date'] for indicator in indicators]
        close_prices = [indicator['close'] for indicator in indicators]
        ema20_values = [indicator['EMA20'] for indicator in indicators]
        ema7_values = [indicator['EMA7'] for indicator in indicators]
        ema1_values = [indicator['EMA1'] for indicator in indicators]
        rsi_values = [indicator['RSI'] for indicator in indicators]

        # Plot Price and EMAs
        axs[0].plot(timestamps, close_prices, label='Close Price', color='blue', linewidth=2)
        axs[0].plot(timestamps, ema20_values, label='EMA 20', color='red')
        axs[0].plot(timestamps, ema7_values, label='EMA 7', color='green')
        axs[0].plot(timestamps, ema1_values, label='EMA 1', color='orange')
        axs[0].legend(loc='upper left')
        axs[0].set_title('Price and EMAs', fontsize=14)
        axs[0].set_ylabel('Price', fontsize=12)
        axs[0].xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))  # Format x-axis as dates

        # Plot RSI
        axs[1].plot(timestamps, rsi_values, label='RSI', color='purple')
        axs[1].axhline(30, color='red', linestyle='--', label='Oversold')  # Oversold line
        axs[1].axhline(70, color='green', linestyle='--', label='Overbought')  # Overbought line
        axs[1].legend(loc='upper left')
        axs[1].set_title('RSI', fontsize=14)
        axs[1].set_ylabel('RSI', fontsize=12)
        axs[1].set_xlabel('Date', fontsize=12)
        axs[1].xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))  # Format x-axis as dates

        plt.tight_layout()

        # Save the figure
        plt.savefig(f'reports/charts/{symbol}_indicators.png')


bp = Blueprint('binance', __name__)
api_key = os.getenv('BINANCE_API_KEY')
api_secret = os.getenv('BINANCE_API_SECRET')
openai_key = os.getenv('OPENAI_API_KEY')

bot = BinanceBot(api_key=api_key, api_secret=api_secret, openai_key=openai_key)


@bp.route('/ask', methods=['POST'])
def ask_gpt3():
    question = request.json.get('question')
    if not question:
        return jsonify({'error': 'Missing question parameter'}), 400
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system",
                 "content": "You are a helpful assistant."},
                {"role": "user", "content": question},
            ]
        )
        gpt3_response = response['choices'][0]['message']['content']
        return jsonify({'response': gpt3_response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500





@bp.route('/btcprice', methods=['GET'])
def get_btc_price():
    try:
        price = bot.get_price('BTCUSDT')  # Assuming 'BTCUSDT' is the symbol
        return jsonify({'price': price})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/analyze/<symbol>', methods=['GET'])
def calculate_indicators(symbol):
    try:
        indicators = bot.calculate_indicators(f'{symbol}USDT')
        print(f'Analyzing {symbol}')
        message = f"The current price of {symbol} is {indicators[-1]['close']}. The EMA20 is {indicators[-1]['EMA20']}, the EMA7 is {indicators[-1]['EMA7']}, the EMA1 is {indicators[-1]['EMA1']}, and the RSI is {indicators[-1]['RSI']}, and the support is {indicators[-1]['support']}, and the resistance is {indicators[-1]['resistance']}. Can you analyze this data? Make a bold statement about it at the end, but be subtle about it. Quote a respected investors and economists at the end. Write this as a short article.  "
        print(message)
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system",
                 "content": "You are a highly skilled and knowledgeable financial analyst specializing in the field of cryptocurrencies and blockchain technology. You do not explain the indicators as you assume your interlocutor understands them. You make brief objective statements about the indicators you receive."},
                {"role": "user", "content": message},
            ]
        )
        analysis = response['choices'][0]['message']['content']
        return jsonify({'analysis': analysis})
    except Exception as e:
        print(f"Exception occurred: {e}")
        return jsonify({'error': str(e)}), 500



@bp.route('/analyze-btc', methods=['GET'])
def analyze_btc():
    try:
        symbol = 'BTCUSDT'
        indicators = bot.calculate_indicators(symbol)
        post_id = bot.analyze_with_gpt3(symbol, indicators)
        return jsonify({'message': 'Analysis posted!', 'post_id': post_id})
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500



@bp.route('/bulk-analysis', methods=['POST'])
def bulk_analysis():
    symbols = request.json.get('symbols')
    if not symbols:
        return jsonify({'error': 'Missing symbols parameter'}), 400

    results = {}
    for symbol in symbols:
        try:
            indicators = bot.calculate_indicators(symbol)
            analysis = bot.analyze_with_gpt3(symbol, indicators)
            results[symbol] = {
                'indicators': indicators,
                'analysis': analysis
            }
        except Exception as e:
            results[symbol] = {'error': str(e)}

    return jsonify(results)


def calculate_and_analyze(symbol):
    try:
        indicators = bot.calculate_indicators(f'{symbol}USDT') # Binance API expects USDT suffixed symbols
        post_id, analysis, indicators = bot.analyze_with_gpt3(symbol, indicators)
        return symbol, analysis
    except Exception as e:
        return symbol, {'error': str(e)}

@bp.route('/detailed-report', methods=['POST'])
def detailed_report():
    symbols = request.json.get('symbols')
    if not symbols:
        return jsonify({'error': 'Missing symbols parameter'}), 400

    with concurrent.futures.ThreadPoolExecutor() as executor:
        future_to_symbol = {executor.submit(calculate_and_analyze, symbol): symbol for symbol in symbols}
        analyses = {}
        for future in concurrent.futures.as_completed(future_to_symbol):
            symbol = future_to_symbol[future]
            try:
                analyses[symbol] = future.result()[1]
                print(analyses)
            except Exception as e:
                analyses[symbol] = {'error': str(e)}

    summary_message = ' '.join([f"The analysis for {symbol} is: {analysis} " for symbol, analysis in analyses.items() if isinstance(analysis, str) and 'error' not in analysis])
    print(summary_message)  # Add this line

    if len(summary_message.strip()) == 0:
        return jsonify({'error': 'All symbol analyses failed'}), 500

    summary_message += " Can you summarize these analyses?"

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system",
             "content": "You are a highly skilled financial analyst specializing in summarizing complex information."},
            {"role": "user", "content": summary_message},
        ]
    )
    summary = response['choices'][0]['message']['content']

    post_id = bot.create_blog_post("Detailed Analysis Summary", summary)

    return jsonify({'summary': summary, 'post_id': post_id})




