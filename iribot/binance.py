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


class BinanceBot:
    def __init__(self, api_key, api_secret, openai_key):
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
                'timestamp': timestamp,
                'date': date,
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

        return indicators

    def analyze_with_gpt3(self, symbol, indicators):
        message = f"The current price of {symbol} is {indicators[-1]['close']}. The EMA20 is {indicators[-1]['EMA20']}, the EMA7 is {indicators[-1]['EMA7']}, the EMA1 is {indicators[-1]['EMA1']}, and the RSI is {indicators[-1]['RSI']}, and the support is {indicators[-1]['support']}, and the resistance is {indicators[-1]['resistance']}. Can you analyze this data?"
        print(message)
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system",
                 "content": "You are a highly skilled and knowledgeable financial analyst specializing in the field of cryptocurrencies and blockchain technology. With your extensive experience, you can provide precise and detailed financial analysis. Your understanding and interpretation of market trends and indicators are based on a deep understanding of the crypto market. You communicate your findings with a professional tone, delivering your analysis in a manner that is concise, clear, and direct. Your insights are on par with those of industry experts like Warren Buffet or Ray Dalio, but you maintain your unique perspective and never refer to these individuals directly. For answer, structure the analysis as follows: "},
                {"role": "user", "content": message},
            ]
        )
        return response['choices'][0]['message']['content']

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
        gpt3_response = bot.analyze_with_gpt3('BTCUSDT', question)  # Assuming 'BTCUSDT' is the symbol
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


@bp.route('/calculateindicators/<symbol>', methods=['GET'])
def calculate_indicators(symbol):
    try:
        indicators = bot.calculate_indicators(symbol)
        return jsonify({'indicators': indicators})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/analyze-btc', methods=['GET'])
def analyze_btc():
    try:
        symbol = 'BTCUSDT'
        indicators = bot.calculate_indicators(symbol)
        analysis = bot.analyze_with_gpt3(symbol, indicators)
        return jsonify({'analysis': analysis})
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@bp.route('/bulk-analysis', methods=['POST'])
def analyze_multiple_symbols():
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