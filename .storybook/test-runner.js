const { injectAxe, checkA11y } = require('axe-playwright');

module.exports = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page) {
    await checkA11y(page, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  },
  setup() {
    jest.setTimeout(60000);
  },
  testMatch: ['**/LoadingSkeleton.stories.@(js|jsx|ts|tsx)'],
};
