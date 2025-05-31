use anchor_lang::prelude::*;

pub mod create_proposal;
pub mod vote;

use create_proposal::*;
use vote::*;

declare_id!("dAo8nCHebC5n737hY7iKvYbqnJZK9BDQURsddiT2Q7Q");

#[program]
pub mod dao_voting {

    use super::*;

    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        title: String,
        description: String,
        options: Vec<String>,
        token: Vec<String>,
        duration: i64,
        token_amount: Vec<u64>,
        proposal_id: u64,
    ) -> Result<()> {
        create_proposal::create_proposal(
            ctx,
            title,
            description,
            options,
            token,
            duration,
            token_amount,
            proposal_id
        )
    }

    pub fn vote(ctx: Context<Vote>, option_index: u8) -> Result<()> {
        vote::vote(ctx, option_index)
    }
}
