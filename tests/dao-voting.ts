import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DaoVoting } from "../target/types/dao_voting";
import { PublicKey, Keypair } from '@solana/web3.js';
import { assert } from 'chai';


describe('dao-voting', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.DaoVoting as Program<DaoVoting>;
  

  it('Creates a new proposal', async () => {

    // Generate a unique proposal ID ( timestamp)
    const proposalId = new anchor.BN(Date.now());
    console.log(proposalId)

    const proposalIdBuffer = proposalId.toArrayLike(Buffer, 'le', 8);
    console.log(proposalIdBuffer)
    //  PDA using the wallet's public key and the unique proposal ID
    const [proposalPDA, _bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("proposal"), provider.wallet.publicKey.toBuffer(), proposalIdBuffer],
      program.programId
    );

    console.log(proposalPDA)

    // Define the title and description of the proposal
    const title = "Test Proposal Title";
    const description = "Test Proposal Description";
    const point = 10;
    // console.log(proposalPDA)

    // Call the createProposal function
    const tx = await program.methods.createProposal(title, description, proposalId, point)
      .accounts({
        proposal: proposalPDA,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([])
      .rpc();
    console.log("Your transaction signature ", tx);

    // Fetch the account details
    const proposalAccount = await program.account.proposal.fetch(proposalPDA);

    console.log('Proposal created successfully:', proposalAccount);
  });
  
  it('Fetches all proposals', async () => {

    // Fetch all proposal accounts
    const proposals = await program.account.proposal.all();
    console.log(proposals.length)

  });

  it("Votes on a proposal", async () => {
    // Fetch all proposal accounts
    const proposals = await program.account.proposal.all();
    const [voterPDA, _bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("voter"), provider.wallet.publicKey.toBuffer(), proposals[0].publicKey.toBuffer()],
      program.programId
    );
    try {
    // Cast a vote for the proposal for 
    // Voting "For" { for: {} } , "Against" { against: {} } , "Abstain" { abstain: {} } 
    await program.methods.vote({ for: {} }) // Voting "For"
      .accounts({
        proposal: proposals[0].publicKey,
        voter: voterPDA,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    

    // Fetch the updated proposal account
    const updatedProposalAccount = await program.account.proposal.fetch(proposals[0].publicKey);
    // const updatedvoteAccount = await program.account.voter.all();

    // console.log(updatedvoteAccount)
    console.log(updatedProposalAccount.votesFor.toNumber())
    } catch (error) {
      // Check transaction logs for "already in use" message
    const transactionLogs = error.transactionLogs || [];
    const alreadyVotedMessage = transactionLogs.some(log => 
        log.includes("already in use")
    );

    if (alreadyVotedMessage) {
        console.error("Error: You have already voted on this proposal.");
    } else {
        console.error("An unexpected error occurred:", error);
    }
    }
    });
});
