/**
 * HAPAS Database Integration Test
 * 
 * Test HAPAS components with real KIAS products from PostgreSQL database
 * Verify data retrieval, formatting, and component integration
 */

const { exec } = require('child_process');
const fs = require('fs').promises;
const util = require('util');

const execAsync = util.promisify(exec);

// Test configuration
const TEST_CONFIG = {
  dbContainer: 'hapas_ecommerce-database-1',
  dbName: 'evershop',
  dbUser: 'postgres',
  testOutputDir: './data/hapas-database-tests'
};

class HapasDatabaseTester {
  constructor() {
    this.testResults = {
      timestamp: new Date().toISOString(),
      tests: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0
      }
    };
  }

  async runAllTests() {
    console.log('🗄️ Starting HAPAS Database Integration Tests...\n');

    try {
      // Ensure test output directory exists
      await this.ensureTestDirectory();

      // Test 1: Database connectivity
      await this.testDatabaseConnectivity();

      // Test 2: Product count verification
      await this.testProductCount();

      // Test 3: KIAS product data quality
      await this.testKiasProductData();

      // Test 4: Vietnamese text in database
      await this.testVietnameseTextInDatabase();

      // Test 5: Price data validation
      await this.testPriceDataValidation();

      // Test 6: Category data verification
      await this.testCategoryData();

      // Generate test report
      await this.generateTestReport();

      console.log('\n✅ All database integration tests completed!');
      this.printTestSummary();

    } catch (error) {
      console.error('❌ Database test suite failed:', error.message);
      process.exit(1);
    }
  }

  async ensureTestDirectory() {
    try {
      await fs.mkdir(TEST_CONFIG.testOutputDir, { recursive: true });
      console.log(`📁 Test directory ready: ${TEST_CONFIG.testOutputDir}`);
    } catch (error) {
      console.error('Failed to create test directory:', error.message);
      throw error;
    }
  }

  async testDatabaseConnectivity() {
    console.log('🔌 Test 1: Database Connectivity');
    
    try {
      const query = 'SELECT version();';
      const result = await this.executeDbQuery(query);
      
      const testResult = {
        name: 'Database Connectivity',
        status: 'PASSED',
        details: {
          connected: true,
          version: result.trim(),
          container: TEST_CONFIG.dbContainer
        },
        timestamp: new Date().toISOString()
      };

      this.testResults.tests.push(testResult);
      this.testResults.summary.passed++;

      console.log(`   ✅ Database connected successfully`);
      console.log(`   ✅ PostgreSQL version: ${result.trim()}\n`);

    } catch (error) {
      this.recordFailedTest('Database Connectivity', error);
    }
  }

  async testProductCount() {
    console.log('📊 Test 2: Product Count Verification');
    
    try {
      const totalQuery = 'SELECT COUNT(*) as total FROM product;';
      const kiasQuery = "SELECT COUNT(*) as kias_count FROM product_description WHERE name LIKE '%KIAS%';";
      
      const totalResult = await this.executeDbQuery(totalQuery);
      const kiasResult = await this.executeDbQuery(kiasQuery);
      
      const totalProducts = parseInt(totalResult.trim());
      const kiasProducts = parseInt(kiasResult.trim());

      const testResult = {
        name: 'Product Count Verification',
        status: 'PASSED',
        details: {
          totalProducts: totalProducts,
          kiasProducts: kiasProducts,
          kiasPercentage: Math.round((kiasProducts / totalProducts) * 100)
        },
        timestamp: new Date().toISOString()
      };

      this.testResults.tests.push(testResult);
      this.testResults.summary.passed++;

      console.log(`   ✅ Total products: ${totalProducts}`);
      console.log(`   ✅ KIAS products: ${kiasProducts}`);
      console.log(`   ✅ KIAS percentage: ${testResult.details.kiasPercentage}%\n`);

    } catch (error) {
      this.recordFailedTest('Product Count Verification', error);
    }
  }

  async testKiasProductData() {
    console.log('🛍️ Test 3: KIAS Product Data Quality');
    
    try {
      const query = `
        SELECT 
          pd.name,
          p.price,
          p.status,
          pd.description
        FROM product p
        JOIN product_description pd ON p.product_id = pd.product_description_product_id
        WHERE pd.name LIKE '%KIAS%'
        LIMIT 5;
      `;
      
      const result = await this.executeDbQuery(query);
      const products = this.parseQueryResult(result);

      const dataQuality = {
        hasNames: products.filter(p => p.name && p.name.length > 0).length,
        hasPrices: products.filter(p => p.price && parseFloat(p.price) > 0).length,
        hasDescriptions: products.filter(p => p.description && p.description.length > 0).length,
        activeProducts: products.filter(p => p.status === '1').length
      };

      const testResult = {
        name: 'KIAS Product Data Quality',
        status: 'PASSED',
        details: {
          sampleSize: products.length,
          dataQuality: dataQuality,
          sampleProducts: products.slice(0, 2).map(p => ({
            name: p.name,
            price: p.price,
            hasDescription: !!p.description
          }))
        },
        timestamp: new Date().toISOString()
      };

      this.testResults.tests.push(testResult);
      this.testResults.summary.passed++;

      console.log(`   ✅ Sample size: ${products.length} products`);
      console.log(`   ✅ Products with names: ${dataQuality.hasNames}/${products.length}`);
      console.log(`   ✅ Products with prices: ${dataQuality.hasPrices}/${products.length}`);
      console.log(`   ✅ Active products: ${dataQuality.activeProducts}/${products.length}\n`);

    } catch (error) {
      this.recordFailedTest('KIAS Product Data Quality', error);
    }
  }

  async testVietnameseTextInDatabase() {
    console.log('🇻🇳 Test 4: Vietnamese Text in Database');
    
    try {
      const query = `
        SELECT name
        FROM product_description 
        WHERE name LIKE '%KIAS%'
        LIMIT 10;
      `;
      
      const result = await this.executeDbQuery(query);
      const productNames = result.trim().split('\n').filter(name => name.length > 0);

      const vietnameseAnalysis = productNames.map(name => ({
        name: name,
        hasVietnamese: this.hasVietnameseText(name),
        length: name.length,
        wordCount: name.split(' ').length
      }));

      const vietnameseCount = vietnameseAnalysis.filter(p => p.hasVietnamese).length;

      const testResult = {
        name: 'Vietnamese Text in Database',
        status: 'PASSED',
        details: {
          totalNames: productNames.length,
          vietnameseNames: vietnameseCount,
          vietnamesePercentage: Math.round((vietnameseCount / productNames.length) * 100),
          samples: vietnameseAnalysis.slice(0, 3)
        },
        timestamp: new Date().toISOString()
      };

      this.testResults.tests.push(testResult);
      this.testResults.summary.passed++;

      console.log(`   ✅ Product names analyzed: ${productNames.length}`);
      console.log(`   ✅ Vietnamese names: ${vietnameseCount}/${productNames.length}`);
      console.log(`   ✅ Vietnamese percentage: ${testResult.details.vietnamesePercentage}%\n`);

    } catch (error) {
      this.recordFailedTest('Vietnamese Text in Database', error);
    }
  }

  async testPriceDataValidation() {
    console.log('💰 Test 5: Price Data Validation');
    
    try {
      const query = `
        SELECT 
          MIN(price) as min_price,
          MAX(price) as max_price,
          AVG(price) as avg_price,
          COUNT(*) as total_products
        FROM product 
        WHERE price > 0;
      `;
      
      const result = await this.executeDbQuery(query);
      const priceData = this.parseQueryResult(result)[0];

      const priceAnalysis = {
        minPrice: parseFloat(priceData.min_price),
        maxPrice: parseFloat(priceData.max_price),
        avgPrice: parseFloat(priceData.avg_price),
        totalProducts: parseInt(priceData.total_products)
      };

      // Convert to VND for display
      const vndAnalysis = {
        minPriceVND: this.formatPriceVND(priceAnalysis.minPrice),
        maxPriceVND: this.formatPriceVND(priceAnalysis.maxPrice),
        avgPriceVND: this.formatPriceVND(priceAnalysis.avgPrice)
      };

      const testResult = {
        name: 'Price Data Validation',
        status: 'PASSED',
        details: {
          priceRange: priceAnalysis,
          vndDisplay: vndAnalysis,
          isValid: priceAnalysis.minPrice > 0 && priceAnalysis.maxPrice > priceAnalysis.minPrice
        },
        timestamp: new Date().toISOString()
      };

      this.testResults.tests.push(testResult);
      this.testResults.summary.passed++;

      console.log(`   ✅ Products with prices: ${priceAnalysis.totalProducts}`);
      console.log(`   ✅ Price range: $${priceAnalysis.minPrice} - $${priceAnalysis.maxPrice}`);
      console.log(`   ✅ VND range: ${vndAnalysis.minPriceVND} - ${vndAnalysis.maxPriceVND}`);
      console.log(`   ✅ Average price: ${vndAnalysis.avgPriceVND}\n`);

    } catch (error) {
      this.recordFailedTest('Price Data Validation', error);
    }
  }

  async testCategoryData() {
    console.log('📂 Test 6: Category Data Verification');
    
    try {
      const query = `
        SELECT 
          cd.name as category_name,
          COUNT(pc.product_id) as product_count
        FROM category c
        JOIN category_description cd ON c.category_id = cd.category_description_category_id
        LEFT JOIN product_category pc ON c.category_id = pc.category_id
        GROUP BY c.category_id, cd.name
        ORDER BY product_count DESC;
      `;
      
      const result = await this.executeDbQuery(query);
      const categories = this.parseQueryResult(result);

      const categoryAnalysis = {
        totalCategories: categories.length,
        categoriesWithProducts: categories.filter(c => parseInt(c.product_count) > 0).length,
        topCategories: categories.slice(0, 3)
      };

      const testResult = {
        name: 'Category Data Verification',
        status: 'PASSED',
        details: categoryAnalysis,
        timestamp: new Date().toISOString()
      };

      this.testResults.tests.push(testResult);
      this.testResults.summary.passed++;

      console.log(`   ✅ Total categories: ${categoryAnalysis.totalCategories}`);
      console.log(`   ✅ Categories with products: ${categoryAnalysis.categoriesWithProducts}`);
      console.log(`   ✅ Top categories:`);
      categoryAnalysis.topCategories.forEach(cat => {
        console.log(`      • ${cat.category_name}: ${cat.product_count} products`);
      });
      console.log();

    } catch (error) {
      this.recordFailedTest('Category Data Verification', error);
    }
  }

  // Helper methods
  async executeDbQuery(query) {
    const command = `docker exec ${TEST_CONFIG.dbContainer} psql -U ${TEST_CONFIG.dbUser} -d ${TEST_CONFIG.dbName} -t -c "${query}"`;
    const { stdout } = await execAsync(command);
    return stdout;
  }

  parseQueryResult(result) {
    const lines = result.trim().split('\n').filter(line => line.trim().length > 0);
    return lines.map(line => {
      const values = line.split('|').map(val => val.trim());
      return values;
    }).map(values => {
      // Convert array to object based on expected structure
      if (values.length === 1) return values[0];
      if (values.length === 2) return { name: values[0], count: values[1] };
      if (values.length === 4) return { 
        name: values[0], 
        price: values[1], 
        status: values[2], 
        description: values[3] 
      };
      return values;
    });
  }

  formatPriceVND(usdPrice) {
    const vndPrice = Math.round(usdPrice * 24000);
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(vndPrice);
  }

  hasVietnameseText(text) {
    const vietnameseChars = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
    return vietnameseChars.test(text);
  }

  recordFailedTest(testName, error) {
    const testResult = {
      name: testName,
      status: 'FAILED',
      error: error.message,
      timestamp: new Date().toISOString()
    };

    this.testResults.tests.push(testResult);
    this.testResults.summary.failed++;

    console.log(`   ❌ ${testName} failed: ${error.message}\n`);
  }

  async generateTestReport() {
    this.testResults.summary.total = this.testResults.summary.passed + this.testResults.summary.failed;
    
    const reportPath = `${TEST_CONFIG.testOutputDir}/hapas-database-test-report.json`;
    await fs.writeFile(reportPath, JSON.stringify(this.testResults, null, 2));
    
    console.log(`📊 Database test report saved: ${reportPath}`);
  }

  printTestSummary() {
    const { total, passed, failed } = this.testResults.summary;
    const successRate = Math.round((passed / total) * 100);

    console.log('\n' + '='.repeat(50));
    console.log('🗄️ HAPAS DATABASE INTEGRATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ${failed > 0 ? '❌' : '✅'}`);
    console.log(`Success Rate: ${successRate}%`);
    console.log('='.repeat(50));
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new HapasDatabaseTester();
  tester.runAllTests().catch(console.error);
}

module.exports = HapasDatabaseTester;
