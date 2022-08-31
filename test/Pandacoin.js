const { expect } = require('chai');
const { TASK_COMPILE_SOLIDITY_LOG_NOTHING_TO_COMPILE } = require('hardhat/builtin-tasks/task-names');
const { EDIT_DISTANCE_THRESHOLD } = require('hardhat/internal/constants');

describe ('Pandacoin', () => {
    let Pandacoin, pandacoin, owner, addr1, addr2;

    beforeEach (async () => {
        Pandacoin = await ethers.getContractFactory('Pandacoin');
        pandacoin = await Pandacoin.deploy ();
        [owner, addr1, addr2, _] = await ethers.getSigners();
    });


    describe ('Deployment', () => {
        it ('Should set the right owner', async () => {
            expect (await pandacoin.admin()).to.equal(owner.address);
        });

        it ('should assign the total supply of tokens to the owner', async() => {
            const adminBalance = await pandacoin.balanceOf (owner.address);
            expect (await pandacoin.totalSupply()).to.equal (adminBalance);
        });
    });

    describe ('Transactions', () => {
        it ('SHould transfer tokens between accounts', async () =>{
            await pandacoin.transfer (addr1.address, 50);
            const addr1Balance = await pandacoin.balanceOf(addr1.address);
            expect (addr1Balance).to.equal (50);

            await pandacoin.connect(addr1).transfer(addr2.address,50);
            const addr2Balance = await pandacoin.balanceOf(addr2.address);
            expect (addr2Balance).to.equal (50);
        });
        it ('Should fail if the sender doesnt have enough tokens', async () =>{
            const initialAdminBalance = await pandacoin.balanceOf(owner.address);

            await expect (
                pandacoin
                    .connect(addr1)
                    .transfer(owner.address, 1)
            )
                .to
                .be
                .revertedWith ('Not enough Tokens');
            expect(
                await pandacoin.balanceOf(owner.address)
            )
                .to
                .equal (initialAdminBalance);
        });

        it ('Should update balances after transfer', async () => {
            const initialAdminBalance = await pandacoin.balanceOf(owner.address);

            await pandacoin.transfer(addr1.address,100);
            await pandacoin.transfer(addr2.address,50);

            const finalAdminBalance = await pandacoin.balanceOf(owner.address);
            expect(finalAdminBalance).to.equal (initialAdminBalance - 150);

            const addr1Balance = await pandacoin.balanceOf(addr1.address);
            expect (addr1Balance).to.equal (100);

            const addr2Balance = await pandacoin.balanceOf(addr2.address);
            expect (addr2Balance).to.equal (50);
        });
    });
}) ;