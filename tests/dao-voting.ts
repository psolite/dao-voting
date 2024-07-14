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


  // Creates a new proposal
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
    const title = "Do you like him";
    const description = "Your vote will help";
    const point = 92;
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
    const allProposal = await program.account.proposal.all();
    const proposals = allProposal.map((proposal) => ({
      title: proposal.account.title.toString(),
      description: proposal.account.description.toString(),
      votesFor: proposal.account.votesFor.toString(),
      votesAgainst: proposal.account.votesAgainst.toString(),
      votesAbstain: proposal.account.votesAbstain.toString(),
      point: proposal.account.point
    }));
    console.log(proposals)
  });


  it("Votes on a proposal", async () => {

    const proposals = await program.account.proposal.all();
    const proposal = proposals[4]

    // VoterPDA
    const [voterPDA, _bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("voter"), provider.wallet.publicKey.toBuffer(), proposal.publicKey.toBuffer()],
      program.programId
    );

    try {
      // Cast a vote for the proposal for 
      // Voting "For" { for: {} } , "Against" { against: {} } , "Abstain" { abstain: {} } 
      await program.methods.vote({ against: {} }) // Voting "For"
        .accounts({
          proposal: proposal.publicKey,
          voter: voterPDA,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      // Fetch the updated proposal account
      const { 
        title, description, votesFor, votesAgainst, votesAbstain, point 
      } = await program.account.proposal.fetch(proposal.publicKey);

      const votedProposal = {
        title: title.toString(),
        description: description.toString(),
        votesFor: votesFor.toString(),
        votesAgainst: votesAgainst.toString(),
        votesAbstain: votesAbstain.toString(),
        point: point
      }
      // console.log(updatedvoteAccount)
      console.log(votedProposal)

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


  it("User Total Reward", async () => {
    // Fetch all voter accounts
    const voterAccounts = await program.account.voter.all();

    // Fetch all proposal accounts
    const proposals = await program.account.proposal.all();

    // Initialize total reward points
    let totalRewardPoints = 0;

    // Filter voter accounts to only include those that belong to the current user
    const userVoterAccounts = voterAccounts.filter(voter =>
      voter.account.user.equals(provider.wallet.publicKey)
    );

    // Iterate over the user's voter accounts
    for (const voter of userVoterAccounts) {
      // Find the corresponding proposal
      const proposal = proposals.find(proposal =>
        proposal.publicKey.equals(voter.account.proposal)
      );

      // If the proposal exists, add its points to the total reward points
      if (proposal) {
        totalRewardPoints += proposal.account.point;
      }
    }

    console.log(`Total reward points for user ${provider.wallet.publicKey.toBase58()}:`, totalRewardPoints);
  });
});
