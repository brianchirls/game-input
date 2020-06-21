const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = class LoadExternalScriptsPlugin {
	constructor(urls) {
		this.urls = urls;
	}

	apply(compiler) {
		compiler.hooks.compilation.tap('LoadExternalScriptsPlugin', compilation => {
			const { externals = {}, plugins } = compilation.options;

			const providePluginDefs = plugins
				.filter(p => p instanceof webpack.ProvidePlugin)
				.map(p => p.definitions);

			const definitions = {};
			providePluginDefs.forEach(defs =>
				Object.keys(defs).forEach(key => definitions[key] = defs[key])
			);

			if ((!externals || !Object.keys(externals).length) &&
				!Object.keys(definitions).length
			) {
				return;
			}

			HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
				'LoadExternalScriptsPlugin',
				(data, cb) => {
					const chunkName = data.outputName.replace(/\.html$/i, '');

					const chunk = compilation.chunks.filter(c => c.name === chunkName)[0];

					if (!chunk) {
						cb(null, data);
						console.warn('no chunk found', chunkName);
						return;
					}

					const externalScripts = new Set();

					chunk.getModules().forEach(
						mod => {
							if (mod.userRequest in externals) {
								externalScripts.add(mod.userRequest);
								return;
							}

							if (mod.rawRequest in externals) {
								externalScripts.add(mod.rawRequest);
								return;
							}

							if (mod.external) {
								console.warn('External dependency missing URL', mod.userRequest);
							}

							mod.dependencies.forEach(
								dep => {
									if (dep.request in externals) {
										externalScripts.add(dep.request);
										return;
									}

									if (dep.module && dep.module.variables) {
										dep.module.variables.forEach(v => {
											const modName = definitions[v.name];
											if (modName) {
												externalScripts.add(modName);
											}
										});
									}
								}
							);
						}
					);

					externalScripts.forEach(name => {
						const src = this.urls[name];
						if (src) {
							data.assetTags.scripts.unshift({
								tagName: 'script',
								voidTag: false,
								attributes: {
									src
								}
							});
						}
					});

					// Tell webpack to move on
					cb(null, data);
				}
			);
		});
	}
};
