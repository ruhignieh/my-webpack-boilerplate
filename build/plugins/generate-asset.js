/*
 * @Descripttion: 
 * @file: 
 * @module: 
 * @version: 1.0.0
 * @Author: Ruhig Nieh
 * @Date: 2020-07-24 16:11:07
 * @LastEditors: Ruhig Nieh
 * @LastEditTime: 2020-07-24 16:25:05
 */ 
const fs = require('fs');
const pluginName = 'WebpackGenerateAsset';

class WebpackGenerateAsset {
    constructor(options) {
        this.filename = options.filename;
        this.fn = options.fn;
        this.files = options.extraFiles || [];
    }

    apply(compiler) {
        compiler.hooks.emit.tapPromise(pluginName, compilation => {
            return new Promise((resolve, reject) => {
                this.fn(compilation, (err, body) => {
                    if (err) { return reject(err); }

                    compilation.assets[this.filename] = {
                        source: () => body,
                        size: () => body.length
                    };

                    this.files.forEach(file => {
                        compilation.assets[file] = {
                            source: () => fs.readFileSync(file),
                            size: () => fs.statSync(file).size
                        };
                    });
                    resolve();
                });
            });
        });
    }
}

module.exports = WebpackGenerateAsset;
