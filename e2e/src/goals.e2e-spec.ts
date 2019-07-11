import { element, by, browser, protractor} from 'protractor';

describe('Goals Component e2e test', () => {
  const EC = protractor.ExpectedConditions;
  beforeAll(() => {
    element(by.id('row')).click();

  });

  it('should click on user and be taken to their goals', () => {
    const dueDate = 'July 12, 2019';
    const description = 'get Chipotle';
    const completed = 'true';
    // const createdBy = 'Bob';
    browser.wait(EC.visibilityOf(element(by.id('goals-table'))), 5000);
    expect(element(by.id('goals-table')).
      getText().
        then(text => {
          expect(text).toContain(dueDate);
          expect(text).toContain(description);
          expect(text).toContain(completed);
        }));
  });
});
