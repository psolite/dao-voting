import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DaoVoting } from "../target/types/dao_voting";
import { PublicKey, Keypair } from '@solana/web3.js';
import { assert } from 'chai';
import { BN } from "bn.js";
import { token } from "@coral-xyz/anchor/dist/cjs/utils";


describe('dao-voting', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.DaoVoting as Program<DaoVoting>;


  // Creates a new proposal
  it('Creates a new proposal', async () => {

    //  PDA using the wallet's public key 
    console.log("here in")
    // const {proposalPda, bump, proposalId} = await program.methods
    //   .getProposalPda()
    //   .accounts({
    //     user: provider.wallet.publicKey.toBase58(),
    //   })
    //   .view();
    //   console.log("here now")
    const proposalId = new BN(Date.now());

    const proposalIdBuffer = proposalId.toArrayLike(Buffer, 'le', 8);
    const [proposalPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("proposal"), provider.wallet.publicKey.toBuffer(), proposalIdBuffer],
      program.programId
    );
    // return { proposalPDA, bump, proposalId };
    // console.log(res.proposalPda, res.bump, res.proposalId)

    // Define the title and description of the proposal
    const title = "Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?Which framework do you prefer?";
    const description = "Choose your preferred web framework.";
    const options = ["React", "Vue", "Angular", "Svelte"];
    const token = [];
    const token_amount = [];
    const duration = new BN(7 * 24 * 60 * 60);

    console.log(proposalId)

    // Call the createProposal function
    const tx = await program.methods.createProposal(title, description, options, token, duration, token_amount, proposalId)
      .accounts({
        proposal: proposalPda,
        user: provider.wallet.publicKey,
        treasury: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([])
      .rpc();
    console.log("Your transaction signature ", tx);

    // Fetch the account details
    const proposalAccount = await program.account.proposal.fetch(proposalPda);

    console.log('Proposal created successfully:', proposalAccount);
  });


  // it('Fetches all proposals', async () => {

  //   // Fetch all proposal accounts
  //   const allProposal = await program.account.proposal.all();

  //   const proposals = allProposal.map((proposal) => {

  //     const optionsWithVoteCounts = proposal.account.options.map((option, index) => {
  //       const voteCount = proposal.account.voteCounts[index];
  //       return `${option.toString()}: ${voteCount.toString()}`;
  //     });

  //     return {
  //       title: proposal.account.title.toString(),
  //       description: proposal.account.description.toString(),
  //       optionsWithVoteCounts,
  //       createdAt: proposal.account.createdAt.toString(),
  //       duration: proposal.account.duration.toString(),
  //       point: proposal.account.point
  //     }
  //   });
  //   console.log(proposals)
  // });


  // it("Votes on a proposal", async () => {

  //   const proposals = await program.account.proposal.all();
  //   const proposal = proposals[0]

  //   // VoterPDA
  //   const [voterPDA, _bump] = PublicKey.findProgramAddressSync(
  //     [Buffer.from("voter"), provider.wallet.publicKey.toBuffer(), proposal.publicKey.toBuffer()],
  //     program.programId
  //   );
  //   const optionIndex = 2;

  //   try {
  //     // Cast a vote for the proposal for 
  //     await program.methods.vote(optionIndex)
  //       .accounts({
  //         proposal: proposal.publicKey,
  //         voter: voterPDA,
  //         user: provider.wallet.publicKey,
  //         systemProgram: anchor.web3.SystemProgram.programId,
  //       })
  //       .rpc();

  //     // Fetch the updated proposal account
  //     const {
  //       title, description, options, voteCounts, point
  //     } = await program.account.proposal.fetch(proposal.publicKey);

  //     const votedProposal = {
  //       title: title.toString(),
  //       description: description.toString(),
  //       options: options.map(option => option.toString()),
  //       voteCounts: voteCounts.map(count => count.toString()),
  //       point: point
  //     }
  //     // console.log(updatedvoteAccount)
  //     console.log(votedProposal)
  //     const voterAccounts = await program.account.voter.all();
  //     console.log(voterAccounts)
  //   } catch (error) {
  //     // Check transaction logs for "already in use" message
  //     const transactionLogs = error.transactionLogs || [];
  //     const alreadyVotedMessage = transactionLogs.some(log =>
  //       log.includes("already in use")
  //     );

  //     if (alreadyVotedMessage) {
  //       console.error("Error: You have already voted on this proposal.");
  //     } else {
  //       console.error("An unexpected error occurred:", error);
  //     }
  //   }
  // });


  // it("User Total Reward", async () => {
  //   // Fetch all voter accounts
  //   const voterAccounts = await program.account.voter.all();

  //   // Fetch all proposal accounts
  //   const proposals = await program.account.proposal.all();

  //   // Initialize total reward points
  //   let totalRewardPoints = 0;

  //   // Filter voter accounts to only include those that belong to the current user
  //   const userVoterAccounts = voterAccounts.filter(voter =>
  //     voter.account.user.equals(provider.wallet.publicKey)
  //   );

  //   // Iterate over the user's voter accounts
  //   for (const voter of userVoterAccounts) {
  //     // Find the corresponding proposal
  //     const proposal = proposals.find(proposal =>
  //       proposal.publicKey.equals(voter.account.proposal)
  //     );

  //     // If the proposal exists, add its points to the total reward points
  //     if (proposal) {
  //       totalRewardPoints += proposal.account.point;
  //     }
  //   }

  //   console.log(`Total reward points for user ${provider.wallet.publicKey.toBase58()}:`, totalRewardPoints);
  // });
});
