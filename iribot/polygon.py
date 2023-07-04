import os
import openai
import requests
from flask import Blueprint, request, jsonify

#Todo
class PolygonStockBot:
    BASE_URL = "https://api.polygon.io"

    def __init__(self, polygon_api_key, openai_key):
        self.api_key = polygon_api_key
        self.openai_key = openai_key
        openai.api_key = self.openai_key
        self.tech_companies = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'FB', 'TSLA', 'INTC', 'CSCO', 'ORCL', 'IBM']

    def fetch_aggregate_bars(self, ticker, multiplier, timespan, start_date, end_date):
        endpoint = f"/v2/aggs/ticker/{ticker}/range/{multiplier}/{timespan}/{start_date}/{end_date}"
        params = {"apiKey": self.api_key}
        response = requests.get(self.BASE_URL + endpoint, params=params)
        return response.json()

    def fetch_ohlc(self, date, symbols_to_keep):
        endpoint = f"/v2/aggs/grouped/locale/us/market/stocks/{date}"
        params = {"apiKey": self.api_key}
        response = requests.get(self.BASE_URL + endpoint, params=params)
        data = response.json()

        # Filter results to keep only specific symbols
        data['results'] = [item for item in data['results'] if item['T'] in symbols_to_keep]

        return data


bp = Blueprint('polygon', __name__)
polygon_api_key = os.getenv('POLYGON_API_KEY')
print(polygon_api_key)
openai_key = os.getenv('OPENAI_API_KEY')

bot = PolygonStockBot(polygon_api_key, openai_key)
# Tech Companies: Apple, Microsoft, Alphabet, Amazon, Facebook, Tesla, Intel, Cisco Systems, Oracle, IBM
tech_companies = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'FB', 'TSLA', 'INTC', 'CSCO', 'ORCL', 'IBM']


@bp.route('/aggregate-bars', methods=['GET'])
def aggregate_bars():
    ticker = request.args.get('ticker')
    multiplier = request.args.get('multiplier')
    timespan = request.args.get('timespan')
    start_date = request.args.get('from')
    end_date = request.args.get('to')

    if None in [ticker, multiplier, timespan, start_date, end_date]:
        return jsonify({"error": "Missing required parameters. Please provide 'ticker', 'multiplier', 'timespan', 'from', and 'to'."}), 400

    return jsonify(bot.fetch_aggregate_bars(ticker, multiplier, timespan, start_date, end_date))


@bp.route('/ohlc', methods=['GET'])
def ohlc():
    date = request.args.get('date')
    return jsonify(bot.fetch_ohlc(date, tech_companies))

