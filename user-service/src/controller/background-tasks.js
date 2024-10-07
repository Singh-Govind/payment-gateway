const { User } = require("../../models");

const updateUserToMerchant = async (userDetails) => {
  try {
    await User.update(
      {
        merchantId: userDetails.merchantId,
        role: "merchant",
      },
      {
        where: {
          userId: userDetails.userId,
        },
      }
    );
  } catch (e) {
    console.log("something went wrong while making merchant", e.message);
  }
};

module.exports = { updateUserToMerchant }