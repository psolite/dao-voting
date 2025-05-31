use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;


#[derive(Accounts)]
#[instruction(
    title: String,
    description: String,
    options: Vec<String>,
    token: Vec<String>,
    duration: i64,
    token_amount: Vec<u64>,
    proposal_id: u64,
)]
pub struct CreateProposal<'info> {
    #[account(init, payer = user, space = 8 +  8 * token.len() + (4 + title.len())  + {4 + description.len()} + (4 + 32) * options.len() + 8 * options.len() + 8 + 8 + 8 * token_amount.len(),
        seeds = [b"proposal", user.key().as_ref(), &proposal_id.to_le_bytes()],
        bump
    )]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub user: Signer<'info>,
    /// CHECK
    #[account(mut)]
    pub treasury: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Proposal {
    pub token: Vec<String>,
    pub title: String,
    pub description: String,
    pub options: Vec<String>,
    pub vote_counts: Vec<u64>,
    pub created_at: i64,
    pub duration: i64,
    pub token_amount: Vec<u64>,
}

pub fn create_proposal(
    ctx: Context<CreateProposal>,
    title: String,
    description: String,
    options: Vec<String>,
    token: Vec<String>,
    duration: i64,
    token_amount: Vec<u64>,
    _proposal_id: u64,
) -> Result<()> {
    
    let proposal = &mut ctx.accounts.proposal;
    let clock = Clock::get().unwrap();
    
    // Transfer 0.01 SOL to the treasury account
    let lamports = 10_000_000; // 0.01 SOL in lamports
    let transfer_instruction = system_instruction::transfer(
        &ctx.accounts.user.key(),
        &ctx.accounts.treasury.key(),
        lamports,
    );
    anchor_lang::solana_program::program::invoke(
        &transfer_instruction,
        &[
            ctx.accounts.user.to_account_info(),
            ctx.accounts.treasury.to_account_info(),
        ],
    )?;

    proposal.title = title;
    proposal.description = description;
    proposal.options = options;
    proposal.vote_counts = vec![0; proposal.options.len()];
    proposal.token_amount = token_amount;
    proposal.created_at = clock.unix_timestamp;
    proposal.duration = duration;
    proposal.token = token;

    Ok(())
}