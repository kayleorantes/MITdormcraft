# MITdormcraft - Reflection on Project Experience

## What Was Hard

### Back-End Synchronization Architecture
- **Challenge**: Understanding when to use declarative syncs vs imperative coordination
- **Learning**: The Requesting concept pattern took time to grasp, but clicking "aha moment" came when I realized it's essentially a secure API gateway
- **Resolution**: Chose pragmatic hybrid approach—imperative authentication (clearer) with sync infrastructure (extensible)

### Concept Independence vs Coordination
- **Challenge**: Balancing concept purity with practical needs (e.g., where does user creation belong?)
- **Example**: Initially put user creation in UserConcept, but moved to AuthenticationConcept for atomic registration
- **Learning**: Concept boundaries aren't dogmatic—group operations that must be atomic

### Front-End/Back-End Parameter Passing
- **Challenge**: Mismatches between how front end sends data and how concepts expect it
- **Example**: Concepts expect individual parameters, but Hono receives JSON objects
- **Resolution**: Added parameter spreading logic in RequestingConcept and careful parameter extraction

## What Went Well

### Concept Design Clarity
- Five core concepts (User, Authentication, Session, RoomTemplate, DesignPost, Engagement) mapped naturally to app features
- Clear state and actions made implementation straightforward
- Each concept file is self-contained and readable

### MongoDB + TypeScript Integration
- MongoDB's flexible schema aligned perfectly with concept state
- TypeScript interfaces caught type errors early
- Deno's native TypeScript support eliminated build complexity

### Incremental Development
- Built and tested concepts individually before integration
- Added authentication layer last (good decision—didn't block feature development)
- Frequent testing caught issues early

## Mistakes Made & Lessons Learned

### Mistake 1: Over-Engineering Syncs Initially
- **What happened**: Spent significant time trying to create declarative syncs for every concept interaction
- **Impact**: Wasted time on infrastructure that wasn't needed for project scope
- **Lesson**: Start with simplest approach that meets requirements; add complexity only when justified
- **How to avoid**: Ask "What's the minimum viable solution?" before implementing patterns

### Mistake 2: Inconsistent API Naming
- **What happened**: Mixed kebab-case filenames (`room-template.ts`) with PascalCase API routes (`/api/RoomTemplate`)
- **Impact**: Front-end confusion about correct endpoint names
- **Lesson**: Establish naming conventions early and document them
- **How to avoid**: Use code generation or strict linting rules to enforce consistency

### Mistake 3: Late Authentication Integration
- **What happened**: Added authentication after building most features
- **Impact**: Had to retrofit token passing into existing front-end code
- **Lesson**: Security architecture should be designed upfront, even if implemented later
- **How to avoid**: Design authentication flow in wireframing phase; add placeholders in code early

### Mistake 4: Insufficient Error Handling Initially
- **What happened**: Early versions crashed on invalid ObjectIds or missing parameters
- **Impact**: Debugging was painful; front end received unclear errors
- **Lesson**: Add validation and error handling as you write functions, not as afterthought
- **How to avoid**: Write validation first, then business logic; use TypeScript strict mode

## Skills Acquired

### New Skills Developed
1. **Concept-Oriented Design**: Thinking in terms of state, actions, and synchronizations
2. **Back-End Security**: Understanding authentication flows, session management, token validation
3. **MongoDB Proficiency**: Using atomic operators (`$addToSet`, `$pull`), TTL indexes, upserts
4. **Deno Ecosystem**: Working with Deno's permissions model, import maps, task runner
5. **Deployment**: Containerization with Docker, deploying to Render, environment variables

### Skills Still Need Development
1. **Advanced Syncs**: Building complex declarative synchronizations with proper action patterns
2. **Performance Optimization**: Database query optimization, indexing strategies, caching
3. **Testing**: Writing comprehensive unit tests for concepts; integration testing for syncs
4. **Real-Time Features**: WebSocket integration for live updates (comments, likes)
5. **Production Hardening**: Rate limiting, logging, monitoring, error tracking

## Use of LLM Tools

### Context Tool Usage
**How I used it**: 
- Generated initial concept boilerplate (class structure, MongoDB setup)
- Helped debug complex MongoDB queries (especially engagement toggleUpvote)
- Explained Requesting concept pattern when documentation was unclear
- Suggested improvements to TypeScript types and error handling

**Effectiveness**:
- ✅ Excellent for: Boilerplate generation, syntax help, explaining patterns
- ⚠️ Mixed for: Architectural decisions (sometimes over-engineered solutions)
- ❌ Struggled with: Project-specific context (had to re-explain structure often)

### Agentic Coding Tool Usage
**How I used it**:
- Automated repetitive tasks (adding similar actions across concepts)
- Refactored code when changing concept interfaces
- Generated front-end API client code from back-end routes

**Effectiveness**:
- ✅ Saved significant time on mechanical tasks
- ⚠️ Required careful review—sometimes introduced subtle bugs
- 🔑 Key lesson: Use for acceleration, not replacement of thinking

### Specific Examples

**Good Use Case**: "Generate a MongoDB concept for managing user sessions with token-based authentication and auto-expiration"
- Result: Clean SessionConcept implementation with TTL indexes
- Outcome: Saved 30+ minutes of writing boilerplate

**Bad Use Case**: "Implement syncs for authentication"
- Result: Over-complex declarative sync system with unnecessary abstractions
- Outcome: Spent hour debugging before simplifying to imperative approach
- Lesson: LLMs don't know project constraints; I needed to constrain the problem better

## Conclusions About LLMs in Software Development

### What LLMs Excel At
1. **Pattern Recognition**: Applying established patterns (MVC, concepts, REST) to new problems
2. **Boilerplate Generation**: Writing repetitive code with variations (CRUD operations, type definitions)
3. **Knowledge Retrieval**: Explaining libraries, syntax, and common approaches
4. **Refactoring**: Mechanical code transformations while preserving behavior

### What LLMs Struggle With
1. **Holistic Design**: Understanding project-wide trade-offs and constraints
2. **Context Retention**: Maintaining awareness of project-specific decisions across sessions
3. **Novel Problems**: Creating genuinely new solutions vs combining existing patterns
4. **Debugging Logic**: Tracing through complex state interactions (better at syntax than semantics)

### Recommended Role for LLMs
**Think of LLMs as a "Senior Developer Pair Programmer"**:
- 🟢 **Good for**: "How do I implement X in Y framework?"
- 🟢 **Good for**: "Refactor this function to use async/await"
- 🟡 **Okay for**: "Design a concept for managing Z" (but verify the design)
- 🔴 **Bad for**: "Build my entire app" (loses coherence; you lose understanding)

### Best Practices I Discovered
1. **Start with design yourself**: Sketch concepts, state, actions on paper BEFORE asking LLM
2. **Use for implementation**: Give LLM clear specs; let it write boilerplate
3. **Review everything**: Understand every line LLM generates; reject if unclear
4. **Iterate with feedback**: "This doesn't handle X case" is more effective than "Fix bugs"
5. **Maintain ownership**: You're the architect; LLM is the assistant

### Impact on Learning
**Positive**:
- Faster iteration let me explore more design alternatives
- Immediate syntax help reduced friction in learning new technologies
- Explanations helped understand concepts (like MongoDB atomic operations)

**Negative**:
- Temptation to accept solutions without fully understanding them
- Sometimes moved too fast and introduced bugs from LLM-generated code
- Risk of not developing "muscle memory" for common patterns

**Balance**: Use LLMs to **accelerate learning**, not **replace it**. Always ask "Why does this work?" when accepting LLM suggestions.

## Overall Experience

### What I'm Proud Of
- Built a functional, deployed web app from scratch in a few weeks
- Implemented secure authentication and authorization
- Created clean, maintainable concept-oriented architecture
- Successfully integrated front end and back end with proper separation

### What I'd Do Differently
- Design authentication flow upfront (even if implemented later)
- Write tests alongside implementation (not after)
- Use TypeScript strict mode from day one
- Document design decisions in code comments as I go

### Key Takeaway
Software development is about **managing complexity**. Concepts help by creating clear boundaries. LLMs help by handling mechanical tasks. But the core skills—understanding requirements, making trade-offs, and architecting coherent systems—remain fundamentally human. The best developers will use LLMs as powerful tools while maintaining deep understanding and creative control.

## Final Thoughts

This project taught me that good software design isn't about using the fanciest patterns or most advanced techniques—it's about choosing the right level of abstraction for the problem at hand. The Requesting concept could have been a complex declarative sync system, but a simple imperative gateway was clearer and sufficient.

LLMs are incredible accelerators, but they're amplifiers—they make good developers faster and bad decisions faster too. The key is maintaining intentionality: always know *why* you're building something *this way*, whether you wrote it yourself or an LLM generated it.

Most importantly: ship real software, get it in front of users, learn from what breaks. No amount of perfect design beats real-world feedback.

