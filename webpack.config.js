const path = require('path'),
  MiniCssExtract = require('mini-css-extract-plugin'),
  OptimizeCss = require('optimize-css-assets-webpack-plugin'),
  UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
  FixStyleEntries = require('webpack-fix-style-only-entries'),
  VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'production',
  watchOptions: {
    ignored: /node_modules/
  },
  entry: {
    theme: ['./src/styles/theme/index.scss'],
    main: ['./src/scripts/theme/index.js'],
    vendors: ['./src/scripts/vendor/index.js']
  },
  stats: 'minimal',
  output: {
    path: path.resolve(__dirname, 'src/assets'),
    library: ['jquery'],
    filename: '[name].bundle.js'
  },
  optimization: {    
    minimizer: [
      new UglifyJsPlugin(),
      new OptimizeCss()
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' 
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.s[a|c]ss$/,
        use: [
          MiniCssExtract.loader,
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')()                
              ]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, 'node_modules')]
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new FixStyleEntries({silent: true}),
    new MiniCssExtract({
      path: path.resolve(__dirname, 'src/assets'),
      filename: '[name].bundle.css'
    })
  ]
};
