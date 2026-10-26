export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type ProblemStatus = 'Solved' | 'Revision Due' | 'Synced' | 'Overdue';
export type Platform = 'LeetCode' | 'GeeksforGeeks' | 'Codeforces' | 'HackerRank' | 'CodeChef';

export interface Problem {
  id: number;
  title: string;
  url: string;
  platform: Platform;
  topic: string;
  difficulty: Difficulty;
  language: string;
  status: ProblemStatus;
  revisionCount: number;
  lastSolved: string;
  nextRevision: string;
  notes: string;
  solution: string;
  githubSynced: boolean;
}

export interface RevisionItem {
  id: number;
  problemId: number;
  title: string;
  topic: string;
  difficulty: Difficulty;
  platform: Platform;
  lastReviewed: string;
  nextReview: string;
  revisionNumber: number;
  status: 'due' | 'overdue' | 'upcoming';
}

export interface Notification {
  id: string;
  type: 'revision' | 'github' | 'summary' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  problemsSolved: number;
  joined: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  target: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

// ===== Landing page data (preserved) =====
export const stats = {
  streak: 27,
  solved: 124,
  revisionsDue: 18,
  revisionSuccess: 73,
};

export const topicProgress = [
  { topic: 'Arrays', solved: 34, total: 40, pct: 85 },
  { topic: 'Hashing', solved: 22, total: 30, pct: 73 },
  { topic: 'Recursion', solved: 14, total: 25, pct: 56 },
  { topic: 'Trees', solved: 9, total: 20, pct: 45 },
  { topic: 'Graphs', solved: 5, total: 18, pct: 28 },
];

export const recentProblems: Problem[] = [
  { id: 1, title: 'Two Sum', url: 'https://leetcode.com/problems/two-sum', platform: 'LeetCode', topic: 'Hashing', difficulty: 'Easy', language: 'Python', status: 'Revision Due', revisionCount: 2, lastSolved: '2d ago', nextRevision: 'Today', notes: 'Use a hash map to store complement indices.', solution: 'def twoSum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i', githubSynced: true },
  { id: 2, title: 'Valid Parentheses', url: 'https://leetcode.com/problems/valid-parentheses', platform: 'LeetCode', topic: 'Stacks', difficulty: 'Easy', language: 'Python', status: 'Synced', revisionCount: 1, lastSolved: '4d ago', nextRevision: '3d', notes: 'Stack-based approach. Push opening, pop on closing.', solution: 'def isValid(s):\n    stack = []\n    mapping = {")":"(", "}":"{", "]":"["}\n    for c in s:\n        if c in mapping:\n            if not stack or stack.pop() != mapping[c]:\n                return False\n        else:\n            stack.append(c)\n    return not stack', githubSynced: true },
  { id: 3, title: 'Majority Element', url: 'https://geeksforgeeks.org/majority-element', platform: 'GeeksforGeeks', topic: 'Arrays', difficulty: 'Easy', language: 'C++', status: 'Synced', revisionCount: 3, lastSolved: '1w ago', nextRevision: '2w', notes: 'Boyer-Moore voting algorithm.', solution: 'int majorityElement(vector<int>& nums) {\n    int count = 0, candidate = 0;\n    for (int n : nums) {\n        if (count == 0) candidate = n;\n        count += (n == candidate) ? 1 : -1;\n    }\n    return candidate;\n}', githubSynced: true },
  { id: 4, title: 'LRU Cache', url: 'https://leetcode.com/problems/lru-cache', platform: 'LeetCode', topic: 'Design', difficulty: 'Medium', language: 'Python', status: 'Solved', revisionCount: 0, lastSolved: '5h ago', nextRevision: '3d', notes: 'Use OrderedDict or doubly linked list + hash map.', solution: 'class LRUCache:\n    def __init__(self, capacity):\n        self.cap = capacity\n        self.cache = OrderedDict()\n    def get(self, key):\n        if key not in self.cache: return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n    def put(self, key, value):\n        self.cache[key] = value\n        self.cache.move_to_end(key)\n        if len(self.cache) > self.cap:\n            self.cache.popitem(last=False)', githubSynced: false },
  { id: 5, title: 'Word Ladder', url: 'https://leetcode.com/problems/word-ladder', platform: 'LeetCode', topic: 'Graphs', difficulty: 'Hard', language: 'Python', status: 'Revision Due', revisionCount: 1, lastSolved: '6d ago', nextRevision: 'Today', notes: 'BFS from start word. Each level = one transformation.', solution: 'def ladderLength(beginWord, endWord, wordList):\n    wordSet = set(wordList)\n    queue = deque([(beginWord, 1)])\n    while queue:\n        word, length = queue.popleft()\n        if word == endWord: return length\n        for i in range(len(word)):\n            for c in "abcdefghijklmnopqrstuvwxyz":\n                nextWord = word[:i] + c + word[i+1:]\n                if nextWord in wordSet:\n                    wordSet.remove(nextWord)\n                    queue.append((nextWord, length + 1))\n    return 0', githubSynced: false },
  { id: 6, title: 'Binary Tree Inorder', url: 'https://leetcode.com/problems/binary-tree-inorder-traversal', platform: 'LeetCode', topic: 'Trees', difficulty: 'Easy', language: 'Python', status: 'Solved', revisionCount: 1, lastSolved: '3d ago', nextRevision: '5d', notes: 'Iterative with stack.', solution: 'def inorderTraversal(root):\n    result, stack = [], []\n    while root or stack:\n        while root:\n            stack.append(root)\n            root = root.left\n        root = stack.pop()\n        result.append(root.val)\n        root = root.right\n    return result', githubSynced: true },
  { id: 7, title: 'Merge K Sorted Lists', url: 'https://leetcode.com/problems/merge-k-sorted-lists', platform: 'LeetCode', topic: 'Linked Lists', difficulty: 'Hard', language: 'Python', status: 'Solved', revisionCount: 3, lastSolved: '1w ago', nextRevision: '1w', notes: 'Min-heap approach.', solution: 'def mergeKLists(lists):\n    heap = []\n    for i, l in enumerate(lists):\n        if l: heapq.heappush(heap, (l.val, i, l))\n    dummy = ListNode()\n    curr = dummy\n    while heap:\n        val, i, node = heapq.heappop(heap)\n        curr.next = node\n        curr = curr.next\n        if node.next:\n            heapq.heappush(heap, (node.next.val, i, node.next))\n    return dummy.next', githubSynced: true },
  { id: 8, title: 'Kth Largest Element', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array', platform: 'LeetCode', topic: 'Heaps', difficulty: 'Medium', language: 'Python', status: 'Revision Due', revisionCount: 1, lastSolved: '5d ago', nextRevision: 'Tomorrow', notes: 'Min-heap of size k.', solution: 'def findKthLargest(nums, k):\n    heap = nums[:k]\n    heapq.heapify(heap)\n    for n in nums[k:]:\n        if n > heap[0]:\n            heapq.heapreplace(heap, n)\n    return heap[0]', githubSynced: false },
];

export const allProblems: Problem[] = [...recentProblems, ...recentProblems].map((p, i) => ({
  ...p,
  id: i + 1,
}));

export const revisionQueue = {
  today: [
    { id: 1, problemId: 1, title: 'Two Sum', topic: 'Hashing', difficulty: 'Easy' as Difficulty, platform: 'LeetCode' as Platform, lastReviewed: '4d ago', nextReview: 'Today', revisionNumber: 2, status: 'due' as const },
    { id: 2, problemId: 6, title: 'Binary Tree Inorder', topic: 'Trees', difficulty: 'Easy' as Difficulty, platform: 'LeetCode' as Platform, lastReviewed: '5d ago', nextReview: 'Today', revisionNumber: 1, status: 'due' as const },
    { id: 3, problemId: 7, title: 'Merge K Sorted Lists', topic: 'Linked Lists', difficulty: 'Hard' as Difficulty, platform: 'LeetCode' as Platform, lastReviewed: '2w ago', nextReview: 'Today', revisionNumber: 3, status: 'due' as const },
  ],
  overdue: [
    { id: 4, problemId: 5, title: 'Word Ladder', topic: 'Graphs', difficulty: 'Hard' as Difficulty, platform: 'LeetCode' as Platform, lastReviewed: '10d ago', nextReview: '2d ago', revisionNumber: 1, status: 'overdue' as const },
  ],
  upcoming: [
    { id: 5, problemId: 4, title: 'LRU Cache', topic: 'Design', difficulty: 'Medium' as Difficulty, platform: 'LeetCode' as Platform, lastReviewed: '5h ago', nextReview: 'In 3d', revisionNumber: 1, status: 'upcoming' as const },
    { id: 6, problemId: 8, title: 'Kth Largest Element', topic: 'Heaps', difficulty: 'Medium' as Difficulty, platform: 'LeetCode' as Platform, lastReviewed: '5d ago', nextReview: 'Tomorrow', revisionNumber: 1, status: 'upcoming' as const },
    { id: 7, problemId: 2, title: 'Valid Parentheses', topic: 'Stacks', difficulty: 'Easy' as Difficulty, platform: 'LeetCode' as Platform, lastReviewed: '4d ago', nextReview: 'In 3d', revisionNumber: 2, status: 'upcoming' as const },
  ],
};

export const gitHubSyncs = [
  { title: 'Two Sum', file: 'two_sum.py', status: 'Synced', time: '2m ago' },
  { title: 'Valid Parentheses', file: 'valid_parentheses.py', status: 'Synced', time: '1h ago' },
  { title: 'Majority Element', file: 'majority_element.cpp', status: 'Synced', time: '3h ago' },
  { title: 'Binary Tree Inorder', file: 'binary_tree_inorder.py', status: 'Synced', time: '1d ago' },
  { title: 'Merge K Sorted Lists', file: 'merge_k_lists.py', status: 'Synced', time: '2d ago' },
];

export const gitHubSyncHistory = [
  { id: 1, title: 'Two Sum', commit: 'a3f2b1c', file: 'hashing/two_sum.py', status: 'Synced', time: '2m ago' },
  { id: 2, title: 'Valid Parentheses', commit: 'b8e4d2a', file: 'stacks/valid_parentheses.py', status: 'Synced', time: '1h ago' },
  { id: 3, title: 'Majority Element', commit: 'c2a9f3e', file: 'arrays/majority_element.cpp', status: 'Synced', time: '3h ago' },
  { id: 4, title: 'Binary Tree Inorder', commit: 'd5b7e1f', file: 'trees/binary_tree_inorder.py', status: 'Synced', time: '1d ago' },
  { id: 5, title: 'Merge K Sorted Lists', commit: 'e9c3a2b', file: 'linked_lists/merge_k_lists.py', status: 'Synced', time: '2d ago' },
];

export const analyticsData = {
  weeklyActivity: [12, 18, 9, 22, 15, 28, 20],
  monthlyActivity: [45, 52, 38, 61, 48, 72, 55, 68, 80, 64, 70, 82],
  revisionTrend: [60, 65, 62, 71, 68, 73, 73],
  weakTopics: [
    { topic: 'Graphs', accuracy: 28 },
    { topic: 'DP', accuracy: 35 },
    { topic: 'Tries', accuracy: 42 },
  ],
  strongTopics: [
    { topic: 'Arrays', accuracy: 85 },
    { topic: 'Hashing', accuracy: 73 },
  ],
  difficultyDistribution: { Easy: 68, Medium: 42, Hard: 14 },
  longestStreak: 31,
};

export const notifications: Notification[] = [
  { id: 'n1', type: 'revision', title: '3 revisions due today', message: 'Two Sum, Binary Tree Inorder, Merge K Sorted Lists', time: '2h ago', read: false },
  { id: 'n2', type: 'github', title: 'GitHub sync completed', message: 'Two Sum synced to codeloop-dsa', time: '3h ago', read: false },
  { id: 'n3', type: 'summary', title: 'Weekly learning summary available', message: 'You solved 20 problems this week', time: '1d ago', read: false },
  { id: 'n4', type: 'system', title: 'Welcome to CodeLoop', message: 'Your learning loop starts now.', time: '5d ago', read: true },
];

export const profileData = {
  name: 'Aman Sharma',
  username: 'amansharma',
  email: 'aman@codeloop.dev',
  bio: 'Final-year CS student. DSA enthusiast. Building my developer profile one problem at a time.',
  joinedDate: 'January 2026',
  stats: {
    solved: 124,
    streak: 27,
    revisionSuccess: 73,
    githubSyncs: 18,
  },
  topTopics: [
    { topic: 'Arrays', count: 34 },
    { topic: 'Hashing', count: 22 },
    { topic: 'Recursion', count: 14 },
    { topic: 'Trees', count: 9 },
  ],
  achievements: [
    { title: '7-Day Streak', desc: 'Solved problems 7 days in a row', icon: 'flame' },
    { title: '100 Problems', desc: 'Solved 100 problems total', icon: 'check' },
    { title: 'Revision Master', desc: 'Completed 50 revisions', icon: 'rotate' },
    { title: 'GitHub Connected', desc: 'Linked GitHub repository', icon: 'github' },
  ],
};

export const adminStats = {
  totalUsers: 1248,
  activeUsers: 842,
  problemsSolved: 15234,
  revisionsCompleted: 8921,
  newUsersThisWeek: 67,
  activeNow: 156,
};

export const adminUsers: AdminUser[] = [
  { id: 'u001', name: 'Aman Sharma', email: 'aman@codeloop.dev', role: 'user', status: 'active', problemsSolved: 124, joined: 'Jan 2026' },
  { id: 'u002', name: 'Priya Patel', email: 'priya@gmail.com', role: 'user', status: 'active', problemsSolved: 89, joined: 'Feb 2026' },
  { id: 'u003', name: 'Rahul Verma', email: 'rahul@college.edu', role: 'user', status: 'suspended', problemsSolved: 45, joined: 'Feb 2026' },
  { id: 'u004', name: 'Sneha Gupta', email: 'sneha@gmail.com', role: 'user', status: 'active', problemsSolved: 203, joined: 'Dec 2025' },
  { id: 'u005', name: 'Karthik Rao', email: 'karthik@college.edu', role: 'user', status: 'active', problemsSolved: 67, joined: 'Mar 2026' },
  { id: 'u006', name: 'Deepak Singh', email: 'deepak@gmail.com', role: 'admin', status: 'active', problemsSolved: 0, joined: 'Nov 2025' },
  { id: 'u007', name: 'Ananya Iyer', email: 'ananya@college.edu', role: 'user', status: 'active', problemsSolved: 156, joined: 'Jan 2026' },
  { id: 'u008', name: 'Vikram Nair', email: 'vikram@gmail.com', role: 'user', status: 'suspended', problemsSolved: 12, joined: 'Mar 2026' },
];

export const auditLogs: AuditLog[] = [
  { id: 'al1', action: 'User suspended', user: 'admin@codeloop.dev', target: 'rahul@college.edu', timestamp: '2h ago', severity: 'warning' },
  { id: 'al2', action: 'User activated', user: 'admin@codeloop.dev', target: 'karthik@college.edu', timestamp: '5h ago', severity: 'info' },
  { id: 'al3', action: 'Admin login', user: 'admin@codeloop.dev', target: 'system', timestamp: '6h ago', severity: 'info' },
  { id: 'al4', action: 'User suspended', user: 'admin@codeloop.dev', target: 'vikram@gmail.com', timestamp: '1d ago', severity: 'warning' },
  { id: 'al5', action: 'Bulk export', user: 'admin@codeloop.dev', target: 'user_data.csv', timestamp: '2d ago', severity: 'info' },
  { id: 'al6', action: 'Failed login attempt', user: 'unknown', target: 'system', timestamp: '3d ago', severity: 'critical' },
];

export const workflowSteps = [
  {
    id: 'solve',
    num: '01',
    title: 'Solve',
    desc: 'Crack the problem on any platform — LeetCode, GeeksforGeeks, Codeforces. CodeLoop doesn\'t get in your way.',
    detail: 'Solve problems wherever you already practice. No workflow change required.',
  },
  {
    id: 'save',
    num: '02',
    title: 'Save',
    desc: 'One click captures the problem, your solution, the approach, and time complexity — structured and searchable.',
    detail: 'Automatically extracts topic, difficulty, and platform metadata.',
  },
  {
    id: 'revise',
    num: '03',
    title: 'Revise',
    desc: 'A spaced-repetition scheduler surfaces the right problem at the right time — before you forget it.',
    detail: 'Revision intervals adapt to your recall accuracy per topic.',
  },
  {
    id: 'build',
    num: '04',
    title: 'Build',
    desc: 'Solved problems sync to your GitHub as clean, well-organized commits — building a real portfolio as a side effect.',
    detail: 'Auto-commits with topic-based folder structure and README entries.',
  },
  {
    id: 'showcase',
    num: '05',
    title: 'Showcase',
    desc: 'A public learning profile that turns your practice history into a credible developer narrative.',
    detail: 'Shareable profile with stats, topic mastery, and revision consistency.',
  },
];

export const visionStages = [
  { stage: 'Stage 1', title: 'DSA Learning', desc: 'Capture, revise, and track every problem you solve.', status: 'live' },
  { stage: 'Stage 2', title: 'Developer Portfolio', desc: 'GitHub sync turns daily practice into a real portfolio.', status: 'live' },
  { stage: 'Stage 3', title: 'AI Learning Assistant', desc: 'Personalized revision plans and weak-topic detection.', status: 'next' },
  { stage: 'Stage 4', title: 'Interview Preparation', desc: 'Company-tagged problems and mock interview tracks.', status: 'planned' },
  { stage: 'Stage 5', title: 'Developer Career Profile', desc: 'A career-ready profile that showcases real learning depth.', status: 'planned' },
];

export const faqData = [
  {
    category: 'Getting Started',
    questions: [
      { q: 'What is CodeLoop?', a: 'CodeLoop helps you turn coding practice into long-term learning. You log the problems you solve, revise them at the right time with spaced repetition, sync solutions to your own GitHub repo, and track your streak and progress.' },
      { q: 'How do I get started?', a: 'Sign up, confirm your email, then add your first solved problem. Use "Save & Schedule Revision" and CodeLoop will remind you to revise it.' },
      { q: 'Is CodeLoop free?', a: 'Yes. Right now every feature is free for everyone, including unlimited problems, full analytics, the Showcase generator, custom revision schedules, GitHub sync and the Chrome extension. Later, a Premium plan may cover unlimited problems, custom revision schedules, full analytics and the Showcase generator; GitHub sync, streaks, the standard revision schedule and the Chrome extension are meant to stay free.' },
      { q: 'How do I install the Chrome extension?', a: 'The extension works on LeetCode, GeeksforGeeks, Codeforces, HackerRank and CodeChef. Open the Extension page (link in the footer or the sidebar), download the zip, unzip it, then in Chrome go to chrome://extensions, turn on Developer mode, click Load unpacked and pick the unzipped folder. Log in from the extension icon and you are ready.' },
    ],
  },
  {
    category: 'Problems',
    questions: [
      { q: 'How are problems stored?', a: 'Each problem keeps its title, platform, topic, difficulty, your solution code, notes and revision history. Only you can see your problems (and your instructor, if you join their class).' },
      { q: 'Can I import problems from LeetCode?', a: 'Not yet. For now, add problems manually along with the problem URL.' },
      { q: 'What platforms are supported?', a: 'LeetCode, GeeksforGeeks, Codeforces, HackerRank and CodeChef, plus "Other" for any website.' },
    ],
  },
  {
    category: 'Revision & Streaks',
    questions: [
      { q: 'How does the revision schedule work?', a: 'After you recall a problem, the next revision is scheduled further out: 3, 7, 14 then 30 days by default. If you forget, it comes back the next day. Premium users can also pick Aggressive or Relaxed schedules in Settings → Revision.' },
      { q: 'How is my streak calculated?', a: 'Your streak counts consecutive days (India time, IST) on which you logged at least one problem. Miss a full day and it resets.' },
    ],
  },
  {
    category: 'GitHub',
    questions: [
      { q: 'How does GitHub sync work?', a: 'GitHub sync is free for everyone. Connect your GitHub account from the GitHub page. When you save a problem with solution code (or press "Sync to GitHub" on a problem), CodeLoop commits your solution to a private repository called codeloop-dsa in your account, organised by topic.' },
      { q: 'What permissions does CodeLoop ask for?', a: 'GitHub\'s "repo" permission, which is required to create and write to a repository. You can disconnect anytime from the GitHub page or revoke access in your GitHub settings.' },
    ],
  },
  {
    category: 'Account',
    questions: [
      { q: 'How do I change or reset my password?', a: 'Change it in Settings → Security. If you forgot it, use "Forgot password?" on the login page and we will email you a reset link.' },
      { q: 'Can I delete my account?', a: 'Yes. Go to Settings → Account → Delete account. This permanently removes your profile, problems and notifications.' },
      { q: 'I am an instructor — how do I get access?', a: 'Instructor accounts are created by a CodeLoop administrator. Contact us and we will set one up for you.' },
    ],
  },
];
