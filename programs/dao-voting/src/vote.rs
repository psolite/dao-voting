use anchor_lang::prelude::*;

use crate::Proposal;

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    #[account(init, payer = user, space = 8 + 32 + 32 + 1, 
        seeds = [b"voter", user.key().as_ref(), proposal.key().as_ref()],
        bump
    )]
    pub voter: Account<'info, Voter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn vote(ctx: Context<Vote>, option_index: u8) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    let voter = &mut ctx.accounts.voter;
    let clock = Clock::get().unwrap();

    // Ensure the option index is within bounds
    if (option_index as usize) >= proposal.vote_counts.len() {
        return Err(ProgramError::InvalidArgument.into());
    }

    // Ensure that the proposal is still within the voting period
    if clock.unix_timestamp > proposal.created_at + proposal.duration {
        return Err(ErrorCode::VotingPeriodEnded.into());
    }

    proposal.vote_counts[option_index as usize] += 1;

    voter.proposal = proposal.key();
    voter.user = *ctx.accounts.user.key;
    voter.option_voted = option_index;

    Ok(())
}


#[account]
pub struct Voter {
    pub proposal: Pubkey,
    pub user: Pubkey,
    pub option_voted: u8
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct VoteOnOption {
    pub option_index: u8, 
}

#[error_code]
pub enum ErrorCode {
    #[msg("The voting period for this proposal has ended.")]
    VotingPeriodEnded,
}