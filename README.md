
# Talent Olympics powered by SuperTeam
# DAO Voting Program 

# Scope of Work
Develop a DAO voting program using Anchor. This program should allow users to vote on proposals and display results. Optionally, implement "privacy" voting using Zero-Knowledge (ZK) proofs or verifiable compute. Reward points should be given to users for participation.

Create a DAO voting system using Anchor.

Implement a voting system and display the results.

Optionally, add privacy voting using ZK proofs or verifiable compute.

Reward points to users for voting participation.


# A guild to use this DAO Voting Program 

This DAO Voting Program  allows user to create Proposal


# How to Install 
To install this you much have Solana and anchor already installed 

1/ pull the program
git pull <github url>
`cd dao-voting`

/2 run `anchor install`

3/ Set your Program address
you must have install solana to you pc 
if yes run `solana-keygen new --outfile ./my_keypair.json` (to get a new keypair)

copy the keypair to target/deploy/dao_voting-keypair.json
you can use this command to copy it `mv ./my_keypair.json ./target/deploy/dao_voting-keypair.json`

4/ run `anchor keys sync` to add the newly generated program address to the neccesary place and remove the old one

5/ on the Achor.toml file depend on with once you are run on either localnet, devnet and mainnet
and also make sure that the wallet you are using to deploy the program is correct
cross check the program address there to make sure is correct

example:

[programs.devnet]
dao_voting = "tePm5Z6oFWmFcPNkbm1t86Ki7SpCm2Qq7Da9uTPM1GZ"

[programs.localnet]
dao_voting = "tePm5Z6oFWmFcPNkbm1t86Ki7SpCm2Qq7Da9uTPM1GZ"

[programs.mainnet]
dao_voting = "tePm5Z6oFWmFcPNkbm1t86Ki7SpCm2Qq7Da9uTPM1GZ"

[provider]
cluster = "devnet"
wallet = "/home/psolite/id.json"

5/ run `anchor build`
6/ run `anchor deploy`

You can now Use the program.

# To Test
In the /tests/dao-voting.ts
The Test is Divided into 4 Parts

1/ Creates a new proposal -  is the first test where user creates Proposal by providing
Title, description and point (Reward)

2/ Fetches all proposals -  to get all proposals created

3/ Votes on a proposal - to vote on a proposal,for test proposals I call one of the proposal with proposals[0] to get one, you can use another number depending on how many proposal you created and to vote you pass this depending on your option: For = { for: {} } , Against = { against: {} } , Abstain = { abstain: {} }

4/ User Total Reward - get user total point 

for any correction(i am open the learn) or help
you can reach out to me on X(twitter) @0xpsoliteSol

# There will be new updates on this , where i will be adding freatures like:
1/ Closing Date of a Proposal
2/ Where user can Create Options 
3/ Front end sample  
you can comment you option to make advance the program

# SOLANA IS THE FUTURE
