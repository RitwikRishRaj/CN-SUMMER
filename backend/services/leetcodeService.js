const axios = require('axios');

class LeetCodeService {
  constructor() {
    this.BASE_URL = 'https://leetcode-stats.tashif.codes';
    this.REQUEST_TIMEOUT = 10000; // 10 seconds
  }

  async fetchUserData(username, endpoint = '') {
    if (!username || typeof username !== 'string') {
      throw new Error('Invalid username provided');
    }

    const url = `${this.BASE_URL}/${username}${endpoint}`;
    
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json'
        },
        timeout: this.REQUEST_TIMEOUT
      });

      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response format from LeetCode API');
      }

      if (response.data.status === 'error' || response.data.status === 'failed') {
        throw new Error(response.data.message || 'Failed to fetch LeetCode data');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error.message);
      if (error.response) {
        throw new Error(`LeetCode API responded with status ${error.response.status}: ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('No response received from LeetCode API. The service might be down.');
      } else {
        throw error;
      }
    }
  }

  async getUserProfile(username) {
    try {
      console.log(`Fetching LeetCode profile for: ${username}`);
      const [profile, contests, badges] = await Promise.all([
        this.fetchUserData(username),
        this.fetchUserData(username, '/contests').catch(e => ({})), // Optional
        this.fetchUserData(username, '/badges').catch(e => [])      // Optional
      ]);

      return this.formatData(profile, contests, badges, username);
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      throw new Error(`Failed to fetch LeetCode profile for ${username}: ${error.message}`);
    }
  }

  formatData(profileData, contestData = {}, badgesData = [], username) {
    if (!profileData || typeof profileData !== 'object') {
      throw new Error('Invalid profile data format from LeetCode API');
    }

    // Extract profile data with defaults
    const {
      totalSolved = 0,
      totalQuestions = 0,
      easySolved = 0,
      totalEasy = 0,
      mediumSolved = 0,
      totalMedium = 0,
      hardSolved = 0,
      totalHard = 0,
      acceptanceRate = 0,
      ranking = 0,
      contributionPoints = 0,
      reputation = 0,
      submissionCalendar = '{}',
      submissionActivity = {},
      matchedUser = {}
    } = profileData;

    // Extract contest data
    const {
      contestAttend = 0,
      rating = 0,
      globalRanking = 0,
      totalParticipants = 0,
      topPercentage = 0,
      badge = null,
      contests = []
    } = contestData;

    // Format the response
    return {
      // User info
      username,
      profileUrl: `https://leetcode.com/${username}`,
      lastUpdated: new Date().toISOString(),
      
      // Profile stats
      ranking: ranking || 0,
      reputation: reputation || 0,
      contributionPoints: contributionPoints || 0,
      
      // Problem stats
      allQuestionsCount: totalQuestions,
      solvedCount: totalSolved,
      acceptanceRate: parseFloat(acceptanceRate) || 0,
      
      // Submission stats
      submissionCalendar: this.parseSubmissionCalendar(submissionCalendar),
      submissionActivity: submissionActivity || {},
      
      // Problem difficulty breakdown
      submitStats: {
        all: { count: totalSolved, submissions: totalSolved },
        easy: { 
          count: easySolved, 
          total: totalEasy,
          submissions: easySolved,
          percentage: totalEasy > 0 ? Math.round((easySolved / totalEasy) * 100) : 0
        },
        medium: { 
          count: mediumSolved, 
          total: totalMedium,
          submissions: mediumSolved,
          percentage: totalMedium > 0 ? Math.round((mediumSolved / totalMedium) * 100) : 0
        },
        hard: { 
          count: hardSolved, 
          total: totalHard,
          submissions: hardSolved,
          percentage: totalHard > 0 ? Math.round((hardSolved / totalHard) * 100) : 0
        }
      },
      
      // Contest info
      contestStats: {
        attended: contestAttend,
        rating: Math.round(rating * 100) / 100, // Round to 2 decimal places
        globalRanking,
        totalParticipants,
        topPercentage: Math.round(topPercentage * 100) / 100, // Round to 2 decimal places
        badge: badge || 'N/A',
        contests: Array.isArray(contests) ? contests : []
      },
      
      // Badges and achievements
      badges: Array.isArray(badgesData) ? badgesData : [],
      
      // Additional user data if available
      user: {
        ...matchedUser,
        // Add any additional user fields here
      }
    };
  }

  parseSubmissionCalendar(calendar) {
    try {
      if (typeof calendar === 'string') {
        return JSON.parse(calendar);
      } else if (typeof calendar === 'object' && calendar !== null) {
        return calendar;
      }
      return {};
    } catch (e) {
      console.error('Error parsing submission calendar:', e);
      return {};
    }
  }

  async getMultipleUserProfiles(usernames) {
    if (!Array.isArray(usernames)) {
      throw new Error('Expected an array of usernames');
    }

    // Process usernames in parallel with a concurrency limit
    const BATCH_SIZE = 5;
    const results = [];
    
    for (let i = 0; i < usernames.length; i += BATCH_SIZE) {
      const batch = usernames.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(username => 
        this.getUserProfile(username)
          .then(profile => ({ username, profile, status: 'fulfilled' }))
          .catch(error => ({
            username,
            error: error.message,
            status: 'rejected'
          }))
      );
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Add a small delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < usernames.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }
}

module.exports = LeetCodeService;
