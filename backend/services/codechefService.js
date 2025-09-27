import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

export default async function getCodeChefStats(username) {
    if(!username) {
        return {
            username: 'N/A',
            totalSolved: 0,
            rating: 0,
            contestBadge: 'No Badge',
            recentProblems: [],
            ratingHistory: []
        };
    }
    const profileUrl = `https://www.codechef.com/users/${username}`;
    const recentProblemsUrl = `https://www.codechef.com/recent/user?user_handle=${username}`;

    try {
        // Part 1: Fetch basic profile info using Cheerio
        const profileResponse = await fetch(profileUrl);
        if (!profileResponse.ok) throw new Error(`Profile fetch failed with status ${profileResponse.status}`);
        
        const profileHtml = await profileResponse.text();
        const $ = cheerio.load(profileHtml);

        // Extract rating
        const ratingText = $(".rating-number").first().text().trim();
        const rating = ratingText ? parseInt(ratingText) : 0;

        // Extract total solved problems
        const solvedText = $(".rating-data-section.problems-solved h3").eq(3).text();
        const totalSolved = solvedText ? parseInt(solvedText.match(/\d+/)?.shift() || '0') : 0;

        // Extract badges
        const badges = $(".widget.badges .badge .badge__title").map((i, el) => $(el).text().trim()).get();
        const contestBadge = badges.length > 0 ? badges.join(', ') : 'No Badge';

        // Part 2: Extract rating history from the rating graph data
        let ratingHistory = [];
        try {
            // Find the script containing the rating graph data
            const scriptContent = $('script').filter((i, el) => 
                $(el).html().includes('var all_rating')
            ).html() || '';
            
            // Extract the JSON data
            const match = scriptContent.match(/var all_rating = (\[.*?\]);/s);
            if (match && match[1]) {
                ratingHistory = JSON.parse(match[1]).map(entry => ({
                    contest: entry.name || 'Unknown Contest',
                    rating: parseInt(entry.rating) || 0,
                    rank: parseInt(entry.rank) || 0,
                    date: new Date(entry.end_date).toLocaleDateString() || 'Unknown Date',
                    delta: parseInt(entry.delta) || 0
                }));
            }
        } catch (e) {
            console.error('Error parsing rating history:', e.message);
        }

        // Part 3: Fetch recent problems using the API endpoint
        let currentPage = 0;
        let maxPages = 1;
        const recentProblems = [];
        const startTime = Date.now();
        const maxTime = 60000;

        while (currentPage < maxPages && (Date.now() - startTime) < maxTime) {
            currentPage++;
            const apiUrl = `${recentProblemsUrl}&page=${currentPage}`;
            
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) break;

                const data = await response.json();
                if (data.max_page) maxPages = data.max_page;

                const problemsHtml = data.content || '';
                const $$ = cheerio.load(problemsHtml);

                $$(".dataTable tbody tr").each((i, row) => {
                    const result = $$(row).find("td:nth-child(3) span").text().trim();
                    
                    if (result.includes('(100)') || result.includes('AC') || result.includes('100')) {
                        const time = $$(row).find(".tooltiptext").text().trim();
                        const title = $$(row).find("td:nth-child(2) a").text().trim();
                        const link = $$(row).find("td:nth-child(2) a").attr('href');
                        const fullLink = link ? `https://www.codechef.com${link}` : null;

                        if (title) {
                            recentProblems.push({
                                title,
                                time,
                                link: fullLink
                            });
                        }
                    }
                });
            } catch (error) {
                console.error(`Error fetching page ${currentPage}:`, error.message);
                break;
            }
        }

        // Return structured data
        return {
            username,
            totalSolved,
            rating,
            contestBadge,
            recentProblems,
            ratingHistory
        };
    } catch (error) {
        console.error('Error fetching CodeChef data:', error.message);
        return null;
    }
}