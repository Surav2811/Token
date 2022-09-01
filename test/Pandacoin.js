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
            const ownerBalance = await pandacoin.balanceOf (owner.address);
            expect (await pandacoin.totalSupply()).to.equal (ownerBalance);
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
            const initialownerBalance = await pandacoin.balanceOf(owner.address);

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
                .equal (initialownerBalance);
        });

        it ('Should update balances after transfer', async () => {
            const initialownerBalance = await pandacoin.balanceOf(owner.address);

            await pandacoin.transfer(addr1.address,100);
            await pandacoin.transfer(addr2.address,50);

            const finalownerBalance = await pandacoin.balanceOf(owner.address);
            expect(finalownerBalance).to.equal (initialownerBalance - 150);

            const addr1Balance = await pandacoin.balanceOf(addr1.address);
            expect (addr1Balance).to.equal (100);

            const addr2Balance = await pandacoin.balanceOf(addr2.address);
            expect (addr2Balance).to.equal (50);
        });
    });


    describe ('Approve', () => {
        it ('Should approve the correct amount and it must not be debited', async () => {
            const initialAllowance = await pandacoin.allowedApprove(addr1.address);
            const initialownerBalance = await pandacoin.balanceOf(owner.address);
            await pandacoin.approve (addr1.address,50);

            const finalAllowance = await pandacoin.allowedApprove(addr1.address);
            expect (finalAllowance).to.equal(initialAllowance + 50);
            const finalownerBalance = await pandacoin.balanceOf(owner.address);
            expect (finalownerBalance).to.equal(initialownerBalance);
        });

        it ('Shouldnt allow the spender to spend the token more than approved amount on behalf of owner', async () => {
            await pandacoin.connect(owner);
            await pandacoin.approve(addr1.address,50);
            await expect (pandacoin.transferFrom(owner.address, addr2.address, 60)).to.revertedWith ('Outside Allowance limit');        
        });

    });

//     describe ('TransferFrom', () =>{
//         it ('Should have required amount of token and if not the balances remain same', async ()=>{
//             const initialAddr1Balance = await pandacoin.balanceOf(addr1.address);
//             const initialAddr2Balance = await pandacoin.balanceOf(addr2.address);
//             await pandacoin.approve (addr1.address,50);


//             await expect (
//                 pandacoin
//                     .connect(owner)
//                     .transferFrom(owner.address, addr1.address,51)
//             )
//                 .to
//                 .be
//                 .revertedWith ('Not enough Tokens');
//             expect(
//                 await pandacoin.balanceOf(addr1.address)
//             )
//                 .to
//                 .equal (initialAddr1Balance);
//                 expect(
//                     await pandacoin.balanceOf(addr2.address)
//                 )
//                     .to
//                     .equal (initialAddr2Balance);                
//         });
        
//         it ('Should have the correct amount transferred to the owner by the sender', async () =>{
//             const initialownerBalance = await pandacoin.balanceOf(owner.address);
//             const initialAddr1Balance = await pandacoin.balanceOf(addr1.address);

//             await pandacoin.connect(owner).transferFrom(owner.address,addr1.address,50);
//             const finalownerBalance = await pandacoin.balanceOf(owner.address);
//             const finalAddr1Balance = await pandacoin.balanceOf(addr1.address);

//             expect (finalownerBalance).to.equal (initialownerBalance - 50);
//             expect (finalAddr1Balance).to.equal (initialAddr1Balance + 50);
            

//         });

//         it ('Should be the correct approved amount', async () =>{
//             const initialApprovedAmount = await pandacoin.allowedAllowance(owner.address);
//             await pandacoin.transferFrom(owner.address, addr1.address, 50);

//             const finalApprovedAmount = await pandacoin.allowedAllowance(addr1.address);
//             expect (finalApprovedAmount).to.equal (initialApprovedAmount - 50);
//         });
    // });
});