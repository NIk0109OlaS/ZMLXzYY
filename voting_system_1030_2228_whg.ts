// 代码生成时间: 2025-10-30 22:28:30
 * Features:
 * - Create a new poll
 * - Vote on a poll
 * - Retrieve poll results
 */

import { Application, Router, send, Status } from 'https://deno.land/x/oak/mod.ts';

// Define the structure for a Poll
interface Poll {
  id: string;
  options: Record<string, number>;
  totalVotes: number;
}

// Define the structure for a Vote
interface Vote {
  pollId: string;
  choice: string;
}

// Define the VotingService with necessary methods
class VotingService {
  private polls: Record<string, Poll> = {};

  // Create a new poll
  createPoll(id: string, options: string[]): Poll {
    if (this.polls[id]) {
      throw new Error('Poll already exists');
    }
    this.polls[id] = {
      id,
      options: options.reduce((acc, option) => ({ ...acc, [option]: 0 }), {}),
      totalVotes: 0,
    };
    return this.polls[id];
  }

  // Vote on a poll
  castVote(vote: Vote): Poll | null {
    const poll = this.polls[vote.pollId];
    if (!poll) {
      throw new Error('Poll not found');
    }
    if (!poll.options[vote.choice]) {
      throw new Error('Invalid choice');
    }
    poll.options[vote.choice] += 1;
    poll.totalVotes += 1;
    return poll;
  }

  // Retrieve poll results
  getPollResults(id: string): Poll | null {
    return this.polls[id] || null;
  }
}

// Instantiate the VotingService
const votingService = new VotingService();

// Set up the router
const router = new Router();

// Create a new poll
router.post('/create-poll', async (ctx) => {
  try {
    const pollId = ctx.request.body().value.pollId;
    const options = ctx.request.body().value.options;
    const poll = votingService.createPoll(pollId, options);
    ctx.response.status = Status.Created;
    ctx.response.body = {
      message: 'Poll created successfully',
      poll,
    };
  } catch (error) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = {
      message: error.message,
    };
  }
});

// Cast a vote on a poll
router.post('/cast-vote', async (ctx) => {
  try {
    const vote = ctx.request.body().value;
    const poll = votingService.castVote(vote);
    ctx.response.body = {
      message: 'Vote cast successfully',
      poll,
    };
  } catch (error) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = {
      message: error.message,
    };
  }
});

// Retrieve poll results
router.get('/poll-results/:id', async (ctx) => {
  try {
    const pollId = ctx.params.id;
    const poll = votingService.getPollResults(pollId);
    if (!poll) {
      ctx.response.status = Status.NotFound;
      ctx.response.body = {
        message: 'Poll not found',
      };
      return;
    }
    ctx.response.body = {
      message: 'Poll results retrieved successfully',
      poll,
    };
  } catch (error) {
    ctx.response.status = Status.InternalServerError;
    ctx.response.body = {
      message: error.message,
    };
  }
});

// Set up the application
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
const PORT = 8000;
console.log(`Voting system server running on port ${PORT}`);
await app.listen({ port: PORT });