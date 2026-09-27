import fs from 'fs';

const docPath = 'C:\\Users\\20092\\OneDrive\\Desktop\\Midnight_Bloom_100_Products_Document.doc';
const txtPath = 'C:\\Users\\20092\\OneDrive\\Desktop\\Midnight_Bloom_100_Products_Document.txt';

const docContent = fs.readFileSync(docPath, 'utf8');
const txtContent = fs.readFileSync(txtPath, 'utf8');

const docReviewCount = (docContent.match(/class="review-item"/g) || []).length;
const docProductCount = (docContent.match(/class="product-box"/g) || []).length;

const txtReviewSectionCount = (txtContent.match(/VERIFIED CUSTOMER REVIEWS/g) || []).length;
const txtProductCount = (txtContent.match(/PRODUCT #\d+:/g) || []).length;

console.log('--- WORD FILE (.doc) ---');
console.log('Total Products in Word File:', docProductCount);
console.log('Total Customer Reviews in Word File:', docReviewCount);
console.log('Word File Size:', (docContent.length / 1024).toFixed(1), 'KB');

console.log('\n--- TEXT FILE (.txt) ---');
console.log('Total Products in Text File:', txtProductCount);
console.log('Total Review Sections in Text File:', txtReviewSectionCount);
console.log('Text File Size:', (txtContent.length / 1024).toFixed(1), 'KB');
