const { expect } = require("chai");

describe("SkillVerifier", function () {
  let SkillVerifier;
  let skillVerifier;
  let owner;
  let worker;
  let interviewer;
  let other;

  beforeEach(async function () {
    // get test accounts
    [owner, worker, interviewer, other] = await ethers.getSigners();

    // get contract factory & deploy fresh instance before each test
    SkillVerifier = await ethers.getContractFactory("SkillVerifier");
    skillVerifier = await SkillVerifier.deploy();
    await skillVerifier.waitForDeployment();
  });

  it("should set deployer as admin", async function () {
    const admin = await skillVerifier.admin();
    expect(admin).to.equal(owner.address);
  });

  it("should allow worker to submit a skill with correct fee", async function () {
    const fee = await skillVerifier.skillFee();

    await expect(
      skillVerifier
        .connect(worker)
        .requestSkillVerification("SKILL-001", "Solidity", { value: fee })
    )
      .to.emit(skillVerifier, "SkillRequested")
      .withArgs("SKILL-001", worker.address);

    const skill = await skillVerifier.skills("SKILL-001");
    expect(skill.skillId).to.equal("SKILL-001");
    expect(skill.skillName).to.equal("Solidity");
    expect(skill.worker).to.equal(worker.address);
    expect(skill.verified).to.equal(false);
  });

  it("should revert if worker sends less than required fee", async function () {
    const fee = await skillVerifier.skillFee();

    await expect(
      skillVerifier
        .connect(worker)
        .requestSkillVerification("SKILL-002", "React", {
          value: fee - 1n, // 1 wei less
        })
    ).to.be.reverted; // you can add .withMessage("...") if you coded a specific error
  });

  it("should allow admin to authorize interviewer", async function () {
    await skillVerifier.authorizeInterviewer(interviewer.address);
    const isAuthorized = await skillVerifier.authorizedInterviewers(
      interviewer.address
    );
    expect(isAuthorized).to.equal(true);
  });

  it("should NOT allow non-admin to authorize interviewer", async function () {
    await expect(
      skillVerifier.connect(worker).authorizeInterviewer(interviewer.address)
    ).to.be.reverted;
  });

  it("should allow authorized interviewer to verify a skill and emit event", async function () {
    const fee = await skillVerifier.skillFee();

    // 1. worker submits skill
    await skillVerifier
      .connect(worker)
      .requestSkillVerification("SKILL-003", "Node.js", { value: fee });

    // 2. admin authorizes interviewer
    await skillVerifier.authorizeInterviewer(interviewer.address);

    // 3. interviewer verifies
    await expect(
      skillVerifier
        .connect(interviewer)
        .verifySkill("SKILL-003", true, "Good understanding")
    )
      .to.emit(skillVerifier, "SkillVerified")
      .withArgs("SKILL-003", worker.address, interviewer.address);

    const skill = await skillVerifier.skills("SKILL-003");
    expect(skill.verified).to.equal(true);
    expect(skill.interviewer).to.equal(interviewer.address);
    expect(skill.notes).to.equal("Good understanding");
  });

  it("should prevent unauthorized address from verifying", async function () {
    const fee = await skillVerifier.skillFee();

    await skillVerifier
      .connect(worker)
      .requestSkillVerification("SKILL-004", "Web3", { value: fee });

    // no authorization done for `other`
    await expect(
      skillVerifier
        .connect(other)
        .verifySkill("SKILL-004", true, "Trying to cheat")
    ).to.be.reverted;
  });

  it("should expose all skill IDs via getAllSkillIds", async function () {
    const fee = await skillVerifier.skillFee();

    await skillVerifier
      .connect(worker)
      .requestSkillVerification("SKILL-101", "Solidity", { value: fee });
    await skillVerifier
      .connect(worker)
      .requestSkillVerification("SKILL-102", "React", { value: fee });

    const ids = await skillVerifier.getAllSkillIds();
    expect(ids).to.include("SKILL-101");
    expect(ids).to.include("SKILL-102");
  });

 it("should return correct data from getSkillVerification", async function () {
  const fee = await skillVerifier.skillFee();

  await skillVerifier
    .connect(worker)
    .requestSkillVerification("SKILL-201", "Blockchain", { value: fee });

  await skillVerifier.authorizeInterviewer(interviewer.address);
  await skillVerifier
    .connect(interviewer)
    .verifySkill("SKILL-201", true, "Strong fundamentals");

  // According to the contract, first return value is skillName, not skillId
  const [skillName, workerAddr, interviewerAddr, , verified] =
    await skillVerifier.getSkillVerification("SKILL-201");

  expect(skillName).to.equal("Blockchain");
  expect(workerAddr).to.equal(worker.address);
  expect(interviewerAddr).to.equal(interviewer.address);
  expect(verified).to.equal(true);
});

});
