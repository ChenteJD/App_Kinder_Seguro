const puppeteer = require('puppeteer');

(async () => {
    let browser;
    try {
        console.log("Iniciando navegador...");
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        let errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
                console.log('BROWSER ERROR:', msg.text());
            }
        });
        
        page.on('pageerror', error => {
            errors.push(error.message);
            console.log('BROWSER PAGE EXCEPTION:', error.message);
        });

        console.log("Navegando a la app...");
        await page.goto('http://localhost:8083', { waitUntil: 'networkidle2', timeout: 30000 });
        
        if(errors.length === 0){
            console.log("No se detectaron errores de JS en consola.");
            const content = await page.content();
            if (content.includes('Cannot use import.meta')) {
               console.log("DETECTADO IMPORT.META EN EL HTML");
            }
        }
        
    } catch (e) {
        console.error("Error al interceptar:", e);
    } finally {
        if (browser) await browser.close();
    }
})();
