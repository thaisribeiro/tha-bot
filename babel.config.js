module.exports = function (api) {
  api.cache(true)

  return {
    presets: [[
      '@babel/preset-env', { useBuiltIns: 'entry' }
    ]],
    plugins: [
      ['@babel/plugin-transform-runtime', { regenerator: true, corejs: 2 }]
    ],
    ignore: ['node_modules/*', 'terraform/*'],
    sourceMaps: true,
    retainLines: true
  }
}
