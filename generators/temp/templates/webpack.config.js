function buildConfig(env: string) {
  const file = `./webpack.${env}.js`;
  // eslint-disable-next-line
  return require(file)({ env });
}

module.exports = buildConfig;
