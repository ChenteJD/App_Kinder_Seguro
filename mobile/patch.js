const fs = require('fs');
const path = require('path');

const cliPath = path.join(__dirname, 'node_modules', '@expo', 'cli', 'build');

if(!fs.existsSync(cliPath)){
    console.log("No @expo/cli found at", cliPath);
}

function walk(dir) {
    if(!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) walk(p);
        else if (p.endsWith('.js')) {
            let content = fs.readFileSync(p, 'utf8');
            if (content.includes('import(')) {
                let modified = false;
                // Busca import(variable) donde la variable es usualmente modulePath o algo similar.
                content = content.replace(/import\(([_a-zA-Z0-9$]+)\)/g, (match, variable) => {
                    if(variable === 'require') return match;
                    if(variable === 'modulePath' || variable === 'resolvedPath' || variable === 'configFile') {
                        modified = true;
                        return `import(require('url').pathToFileURL(${variable}).href)`;
                    }
                    return match;
                });
                
                // Tambien hay código tipo `import(resolvedConfigPath)`
                // Expo 50+ usa configuraciones de Metro con import
                if (modified) {
                    fs.writeFileSync(p, content);
                    console.log('Patched:', p);
                }
            }
        }
    });
}
walk(cliPath);
console.log('Script finalizado');
