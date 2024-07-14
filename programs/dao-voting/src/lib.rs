use anchor_lang::prelude::*;

declare_id!("tePm5Z6oFWmFcPNkbm1t86Ki7SpCm2Qq7Da9uTPM1GZ");

#[program]
pub mod dao_voting {
    use super::*;

    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        title: String,
        description: String,
        _proposal_id: u64,
        point: u32,
    ) -> Result<()> {
        
        let proposal = &mut ctx.accounts.proposal;

        proposal.title = title;
        proposal.description = description;
        proposal.votes_for = 0;
        proposal.votes_against = 0;
        proposal.votes_abstain = 0;
        proposal.point = point;

        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, vote: VoteOption) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let voter = &mut ctx.accounts.voter;

        match vote {
            VoteOption::For => proposal.votes_for += 1,
            VoteOption::Against => proposal.votes_against += 1,
            VoteOption::Abstain => proposal.votes_abstain += 1,
        }

        voter.proposal = proposal.key();
        voter.user = *ctx.accounts.user.key;

        Ok(())
    }

}

#[derive(Accounts)]
#[instruction(
    title: String,
    description: String,
    proposal_id: u64
)]
pub struct CreateProposal<'info> {
    #[account(init, payer = user, space = 8 + 64 + 64 + 8 + 8 + 8 + 8,
        seeds = [b"proposal", user.key().as_ref(), &proposal_id.to_le_bytes()],
        bump
    )]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    #[account(init, payer = user, space = 8 + 32 + 32, 
        seeds = [b"voter", user.key().as_ref(), proposal.key().as_ref()],
        bump
    )]
    pub voter: Account<'info, Voter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Proposal {
    pub title: String,
    pub description: String,
    pub votes_for: u64,
    pub votes_against: u64,
    pub votes_abstain: u64,
    pub point: u32,
}

#[account]
pub struct Voter {
    pub proposal: Pubkey,
    pub user: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub enum VoteOption {
    For,
    Against,
    Abstain,
}
