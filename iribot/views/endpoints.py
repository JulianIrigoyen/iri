
import os
from binance.spot import Spot
import openai
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
import traceback


bp = Blueprint('endpoints', __name__)

def setup_routes(bot):
    @bp.route('/ask', methods=['POST'])
    def ask_gpt3():
        openai.api_key = os.getenv('OPENAI_API_KEY')
        question = request.json.get('question')
        if not question:
            return jsonify({'error': 'Missing question parameter'}), 400
        try:
            response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
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
            print('getting btc price')
            price = bot.get_price('BTCUSDT')
            return jsonify({'price': f'The price is: {price}'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
    @bp.route('/calculateindicators/<symbol>', methods=['GET'])
    def calculate_indicators(symbol):
        indicators = bot.calculate_indicators(symbol)
        bot.plot_indicators(indicators)
        return jsonify(indicators)
        
    @bp.route('/analyze-btc', methods=['GET'])
    def analyze_btc():
        print('analyzing btc 1')
        try:
            symbol = 'BTCUSDT'
            indicators = bot.calculate_indicators(symbol)
            print(f'Got indicators --  {indicators}')
            analysis = bot.analyze_with_gpt3(symbol, indicators)
            return jsonify({'analysis': analysis})
        except Exception as e:
            traceback.print_exc()  # Print traceback of the exception
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
                bot.plot_indicators(symbol, indicators)
                analysis = bot.analyze_with_gpt3(symbol, indicators)
                results[symbol] = {
                    'indicators': indicators,
                    'analysis': analysis
                }
            except Exception as e:
                results[symbol] = {'error': str(e)}
        
        return jsonify(results)

    
    