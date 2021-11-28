const CryptoDonater = artifacts.require("./CryptoDonater.sol");

contract("CryptoDonater", accounts => {

  // Testing creation of one new category pool
  it("...should create a new category pool.", async () => {
    const cryptoDonaterInstance = await CryptoDonater.deployed();

    // Create a new category pool
    await cryptoDonaterInstance.createCategory("Logistics", 200, { from: accounts[0] });

    // Get the length of the category pool list
    const catListLength = await cryptoDonaterInstance.getCatListLength();
    assert.equal(catListLength, 1, "Length of the category pool list should be 1.");

    // Get the details of the newly added category pool
    const catItem = await cryptoDonaterInstance.getCatValues(0);
    assert.equal(catItem[0], "Logistics", "Newly added category pool should have name 'Logistics'.");
    assert.equal(catItem[1], 0, "Newly added category pool should have balance 0.");
    assert.equal(catItem[2], 200, "Newly added category pool should have need 200.");
  });

  // Testing creation of one additional category pool, bringing the total to 2
  it("...should create one additional category pool, bringing list total to 2.", async () => {
    const cryptoDonaterInstance = await CryptoDonater.deployed();

    // Create a new category pool
    await cryptoDonaterInstance.createCategory("Research", 300, { from: accounts[0] });

    // Get the length of the category pool list
    const catListLength = await cryptoDonaterInstance.getCatListLength();
    assert.equal(catListLength, 2, "Length of the category pool list should be 2.");

    // Get the details of the first category pool
    const catItem1 = await cryptoDonaterInstance.getCatValues(0);
    assert.equal(catItem1[0], "Logistics", "First category pool should have name 'Logistics'.");
    assert.equal(catItem1[1], 0, "First category pool should have balance 0.");
    assert.equal(catItem1[2], 200, "First category pool should have need 200.");

    // Get the details of the second (newly added) category pool
    const catItem2 = await cryptoDonaterInstance.getCatValues(1);
    assert.equal(catItem2[0], "Research", "Second category pool should have name 'Research'.");
    assert.equal(catItem2[1], 0, "Second category pool should have balance 0.");
    assert.equal(catItem2[2], 300, "Second category pool should have need 300.");
  });

  // Testing updating need of an existing category pool
  it("...should update need of an existing category pool.", async () => {
    const cryptoDonaterInstance = await CryptoDonater.deployed();

    // Update the need of an existing category pool
    await cryptoDonaterInstance.updateCategoryNeed(1, 500, { from: accounts[0] });

    // Get the length of the category pool list
    const catListLength = await cryptoDonaterInstance.getCatListLength();
    assert.equal(catListLength, 2, "Length of the category pool list should be 2.");

    // Get the details of the updated category pool
    const catItem = await cryptoDonaterInstance.getCatValues(1);
    assert.equal(catItem[0], "Research", "Updated category pool should have name 'Research'.");
    assert.equal(catItem[1], 0, "Updated category pool should have balance 0.");
    assert.equal(catItem[2], 800, "Updated category pool should have need 800.");
  });

  // Testing donation to an existing category pool
  it("...should update balance and need after donation is successful.", async () => {
    const cryptoDonaterInstance = await CryptoDonater.deployed();

    // Send donation an existing category pool
    await cryptoDonaterInstance.sendDonation(1, { from: accounts[0], value: 200});

    // Get the length of the category pool list
    const catListLength = await cryptoDonaterInstance.getCatListLength();
    assert.equal(catListLength, 2, "Length of the category pool list should be 2.");

    // Get the details of the updated category pool
    const catItem = await cryptoDonaterInstance.getCatValues(1);
    assert.equal(catItem[0], "Research", "Donated category pool should have name 'Research'.");
    assert.equal(catItem[1], 200, "Donated category pool should have balance 200.");
    assert.equal(catItem[2], 600, "Donated category pool should have need 600.");
  });

  // Testing need does not fall below 0 if donation is greater than need
  it("...should update need to 0 when donation is greater than total need.", async () => {
    const cryptoDonaterInstance = await CryptoDonater.deployed();

    // Send donation an existing category pool
    await cryptoDonaterInstance.sendDonation(1, { from: accounts[0], value: 1000});

    // Get the length of the category pool list
    const catListLength = await cryptoDonaterInstance.getCatListLength();
    assert.equal(catListLength, 2, "Length of the category pool list should be 2.");

    // Get the details of the updated category pool
    const catItem = await cryptoDonaterInstance.getCatValues(1);
    assert.equal(catItem[0], "Research", "Donated category pool should have name 'Research'.");
    assert.equal(catItem[1], 1200, "Donated category pool should have balance 1200.");
    assert.equal(catItem[2], 0, "Donated category pool should have need 0.");
  });

  // Testing need does not fall below 0 if donation is greater than need
  it("...should get latest price.", async () => {
    const cryptoDonaterInstance = await CryptoDonater.deployed();

    // Send donation an existing category pool
    const price = await cryptoDonaterInstance.getLatestPrice();
    console.log(price);
    assert.equal(price, 4123.094, "Latest Chainlink price.");

  });

});
