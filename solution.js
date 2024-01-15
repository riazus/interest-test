/*** INSTRUCTIONS FOR VISUALISATION ***/
/*
  In the Chrome:
    1. open new page
    2. F12
    3. Go to Sources tab
    4. Create new snippet
    5. Copy paste this code to the snippent window
*/

(() => {
  /**
   * Grille of rates and durations in years.
   * Modify for test algo
   */
  const grille = {
    10: 2.9,
    12: 3.2,
    //15: 1.15,
    15: 3.5,
    20: 3.8,
    22: 3.8,
    //25: 1.8,
    25: 4.4,
  };

  /**
   * Calculation of payment's annuity
   * @param {number} duration Duration in monthly format
   * @param {number} rate Rate of the loan (ex: 0.0025 <= 3 / 12 / 100 = 3)
   * @returns Annuity of payment
   */
  var calculateAnnuityPayment = (duration, rate) =>
    rate / (1 - Math.pow(1 + rate, -duration));

  /**
   * Classic calculation of monthly interest
   * @param {number} amount Amount of the loan
   * @param {number} duration Duration in monthly format
   * @param {number} rate Rate of the loan (ex: 0.0025 <= 3 / 12 / 100 = 3)
   * @returns Monthly payment during loan
   */
  var calculateMonthlyClassicPayment = (amount, duration, rate) =>
    amount * calculateAnnuityPayment(duration, rate);

  /**
   * Calculation loan's total interest
   * @param {number} amount Amount of loan
   * @param {number} duration Duration in monthly format
   * @param {number} rate Rate of the loan (ex: 0.0025 <= 3 / 12 / 100 = 3)
   * @returns Total interests of loan
   */
  var calculateTotalInterests = (amount, duration, rate) => {
    const m = calculateMonthlyClassicPayment(amount, duration, rate);

    return m * duration - amount;
  };

  /**
   * Calculation of credit line with two loans
   * @param {number} m1 short loan's monthly payment
   * @param {number} d1 short loan's duration
   * @param {number} M2 long loan's amount
   * @param {number} rate2 long loan's rate (ex: 0.0025 <= 3 / 12 / 100 = 3)
   * @param {number} d2 long loan's duration
   * @returns Monthly interest's payment during credit line
   */
  var calculateCreditLine = (m1, d1, M2, rate2, d2) =>
    (M2 + m1 / calculateAnnuityPayment(d1, rate2)) *
    calculateAnnuityPayment(d2, rate2);

  /**
   * Ratio calculation of two loans
   * @param {number} rate1 short loan's rate (ex: 0.0025 <= 3 / 12 / 100 = 3)
   * @param {number} duration1 short loan's duration in month
   * @param {number} rate2 long loan's rate (ex: 0.0025 <= 3 / 12 / 100 = 3)
   * @param {number} duration2 long loan's duration in month
   * @returns Coefficient of two loans
   */
  var ratio = (rate1, duration1, rate2, duration2) => {
    var totalAmount = 1;

    var m2 = calculateMonthlyClassicPayment(totalAmount, duration2, rate2);

    var interest2 = totalAmount * rate2;
    var m1 = m2 - interest2;

    var amount1 = (m1 * (1 - Math.pow(1 + rate1, -duration1))) / rate1;

    return amount1 / totalAmount;
  };

  /**
   * Searching the best option between possible durations and rates
   * Brute-force solution
   * Time complexity: O(n^2)
   * Space complexity: O(1)
   * @param {object} grille Grille of durations and rates
   */
  var searchBestOption = (grille) => {
    var keys = Object.keys(grille);
    var minInterest = Number.MAX_VALUE;

    console.group("Interest for each pair group");
    for (var i = 0; i < keys.length - 1; i++) {
      for (var j = i + 1; j < keys.length; j++) {
        const rate1 = grille[keys[i]] / 100 / 12;
        const d1 = keys[i] * 12;

        const rate2 = grille[keys[j]] / 100 / 12;
        const d2 = keys[j] * 12;

        const shortLoanCoef = ratio(rate1, d1, rate2, d2);

        // test amount
        const globalAmount = 300000;
        const M1 = globalAmount * shortLoanCoef;
        const M2 = globalAmount - M1;

        const m1 = calculateMonthlyClassicPayment(M1, d1, rate1);

        const mGlobal = calculateCreditLine(m1, d1, M2, rate2, d2);

        console.log(
          `${keys[i]}: ${grille[keys[i]]} | ${keys[j]}: ${
            grille[keys[j]]
          } | [ratio - ${shortLoanCoef}] = ${mGlobal}`
        );

        minInterest = minInterest < mGlobal ? minInterest : mGlobal;
      }
    }
    console.groupEnd();

    console.log("Minimal interest:", minInterest);
  };

  searchBestOption(grille);
})();
