/**
* Build config for electron 'Main Process' filae
*/

import webpack from 'webpack';
import merge from 'webpack-merge';
import BabiliPlugin from 'babili-webpack-plugin';
import baseConfig from './webpack.config.base';

export default merge(baseConfig, {

    devtool: 'cheap-module-source-map',

    entry: ['babel-polyfill', './app/main'],

    // 'main.js' in root
    output: {
        path: __dirname,
        filename: './static/main.js'
    },

    plugins: [
        new BabiliPlugin(),

        // NODE_ENV should be production so that modules do not perform certain development checks
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        })
    ],

    /**
     * Set targed to Electron speciffic node.js env.
     * https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
     */
    target: 'electron-main',

    /**
     * Disables webpack processing of __dirname and __filename.
     * If you run the bundle in node.js it falls back to these values of node.js.
     * https://github.com/webpack/webpack/issues/2010
     */
    node: {
        __dirname: false,
        __filename: false
    }
});
