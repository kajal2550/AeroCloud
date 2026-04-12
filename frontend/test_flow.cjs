const { chromium } = require('playwright'); // if available

// We'll use a basic playwright script to check if the animation shows
(async () => {
    try {
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();
        
        await page.goto('http://localhost:5173/login');
        await page.fill('input[type="email"]', 'test@aerocloud.com');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');
        
        await page.waitForTimeout(2000);
        
        // click first book now
        const bookBtns = await page.$$('text=Book Now');
        if (bookBtns.length > 0) {
            await bookBtns[0].click();
            await page.waitForTimeout(1000);
            
            // Passenger form
            await page.fill('input[placeholder="John Doe"]', 'Playwright Tester');
            await page.click('button:has-text("Confirm Details")');
            await page.waitForTimeout(1000);
            
            // Seat selection
            const availableSeats = await page.$$('.seat-pod:not(.occupied)');
            if (availableSeats.length > 0) {
                await availableSeats[0].click();
                await page.waitForTimeout(500);
                await page.click('button:has-text("Confirm Seat Selection")');
                await page.waitForTimeout(1000);
                
                // Payment Form
                await page.fill('input[placeholder="John Doe"]', 'Playwright Tester');
                await page.fill('input[placeholder="0000 0000 0000 0000"]', '4111 1111 1111 1111');
                await page.fill('input[placeholder="MM/YY"]', '12/26');
                await page.fill('input[placeholder="***"]', '123');
                
                await page.click('button:has-text("Pay $")');
                await page.waitForTimeout(500);

                // check if coin animation is visible
                const coinProcessing = await page.$('.processing-text');
                if (coinProcessing) {
                    console.log('SUCCESS: Coin Animation found!');
                } else {
                    console.log('FAIL: Coin Animation NOT found.');
                }
            } else {
                console.log('No seats available');
            }
        }
        await browser.close();
    } catch (err) {
        console.error(err);
    }
})();
