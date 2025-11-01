"""
Main Actor logic.

This module contains the core functionality of the Apify Actor.
"""

from apify import Actor


async def main() -> None:
    """
    Main function of the Actor.

    This function is executed when the Actor is run. It retrieves input data,
    processes it, and stores the results in the dataset.
    """
    async with Actor:
        # Get input from the Actor
        actor_input = await Actor.get_input() or {}
        Actor.log.info(f'Received input: {actor_input}')

        # Extract configuration from input
        start_urls = actor_input.get('startUrls', [])
        max_crawl_depth = actor_input.get('maxCrawlDepth', 0)
        max_results = actor_input.get('maxResults', 100)

        if not start_urls:
            Actor.log.error('No start URLs provided in the input')
            return

        Actor.log.info(f'Starting Actor with {len(start_urls)} URLs')
        Actor.log.info(f'Max crawl depth: {max_crawl_depth}')
        Actor.log.info(f'Max results: {max_results}')

        # Process each URL
        results_count = 0
        for request in start_urls[:max_results]:
            url = request.get('url')
            if not url:
                continue

            Actor.log.info(f'Processing: {url}')

            # Example: Store a result in the dataset
            # In a real Actor, you would fetch and process the URL here
            result = {
                'url': url,
                'title': f'Page at {url}',
                'processed_at': Actor.now().isoformat(),
            }

            await Actor.push_data(result)
            results_count += 1

            if results_count >= max_results:
                break

        Actor.log.info(f'Actor finished. Processed {results_count} URLs')
