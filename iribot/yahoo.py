import pandas as pd
import numpy as np
import yahoo_fin.stock_info as si
from flask import Blueprint, request, jsonify
import traceback

# TODO

class YahooDataLoader:
    def __init__(self):
        self.start_date = '2022-02-02'
        self.end_date = '2023-02-02'
        self.tickers = ['AAPL', 'IBM', 'MSFT', 'WMT', 'AMGN', 'AXP', 'BA', 'NKE', 'PG', 'TRV', 'UNH', 'V', 'VZ', 'WBA',
                        'WMT']
        self.ratio_stat = ['Trailing P/E', 'Forward P/E', 'PEG Ratio (5 yr expected)', 'Price/Book (mrq)',
                           'Price/Sales (ttm)', 'Enterprise Value/EBITDA', 'Enterprise Value/Revenue']

    def load_data(self):
        data = pd.DataFrame(columns=self.tickers)
        for ticker in self.tickers:
            data[ticker] = si.get_data(ticker,
                                       self.start_date,
                                       self.end_date)['adjclose']
        return data

    def get_fundamental(self):
        df_fundamentals = pd.DataFrame()
        for ticker in self.tickers:
            fundamental_ratio = si.get_stats_valuation(ticker)
            fundamental_ratio.index = fundamental_ratio['Unnamed: 0']
            fundamental_ratio = fundamental_ratio.drop('Unnamed: 0', axis=1)
            tmp_table = fundamental_ratio.T
            tmp_table = tmp_table.loc[:, self.ratio_stat]
            df_fundamentals = df_fundamentals.append(tmp_table)
        df_fundamentals.index = self.tickers
        df_fundamentals = df_fundamentals.apply(pd.to_numeric, errors='coerce')
        df_fundamentals.dropna(inplace=True)
        return df_fundamentals

    def get_over_under_stocks(self):
        df_fundamentals = self.get_fundamental()
        df_fundamentals['Trailing P/E'].mean()
        df_fundamentals['over_under'] = (df_fundamentals['Trailing P/E']) / (df_fundamentals['Trailing P/E'].mean())
        category = []
        for i in df_fundamentals['over_under']:
            if i < 1:
                category.append('Under Valued')
            elif i > 1:
                category.append('Over Valued')
            else:
                category.append('Fair Valued')
        df_fundamentals['Category'] = category
        return df_fundamentals

bp = Blueprint('yahoo', __name__)

@bp.route('/api/fundamentals', methods=['GET'])
def get_fundamentals():
    data_loader = YahooDataLoader()
    fundamentals = data_loader.get_over_under_stocks()
    return jsonify(fundamentals.to_dict())
