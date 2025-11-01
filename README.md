# Apify Actor

This is a template for an Apify Actor built with Python. It provides a basic structure following Apify's best practices and latest guidelines.

## Features

- Built with the Apify SDK for Python
- Follows the standard Actor directory structure
- Includes input schema for easy configuration
- Ready to deploy on the Apify platform

## Structure

```
.
├── .actor/
│   ├── actor.json          # Actor configuration
│   ├── input_schema.json   # Input schema definition
│   └── Dockerfile          # Docker configuration
├── src/
│   ├── __main__.py         # Actor entrypoint
│   └── main.py             # Main Actor logic
├── requirements.txt        # Python dependencies
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Input

The Actor accepts the following input parameters:

- **startUrls** (required): Array of URLs to process
- **maxCrawlDepth**: Maximum depth of crawling (default: 0)
- **maxResults**: Maximum number of results to return (default: 100)
- **proxyConfiguration**: Proxy settings for the Actor

## Output

The Actor stores results in the default dataset with the following structure:

```json
{
  "url": "https://example.com",
  "title": "Page title",
  "processed_at": "2025-11-01T12:00:00.000Z"
}
```

## Local Development

### Prerequisites

- Python 3.12 or higher
- pip

### Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the Actor locally:
   ```bash
   apify run
   ```

   Or run directly with Python:
   ```bash
   python -m src
   ```

### Testing with Input

Create a file `.actor/input.json` with your test input:

```json
{
  "startUrls": [
    { "url": "https://apify.com" }
  ],
  "maxResults": 10
}
```

Then run the Actor with:
```bash
apify run
```

## Deployment

### Using Apify CLI

1. Login to Apify:
   ```bash
   apify login
   ```

2. Push to Apify platform:
   ```bash
   apify push
   ```

### Using Git Integration

1. Connect your GitHub repository in the Apify Console
2. Push your changes to the repository
3. The Actor will be automatically built and deployed

## Customization

### Modifying the Actor Logic

Edit `src/main.py` to implement your custom logic. The main function is called when the Actor runs and has access to the Apify SDK context.

### Adding Dependencies

Add any Python packages you need to `requirements.txt`.

### Updating Input Schema

Modify `.actor/input_schema.json` to change the input parameters your Actor accepts.

## Resources

- [Apify SDK for Python Documentation](https://docs.apify.com/sdk/python)
- [Apify Actor Documentation](https://docs.apify.com/platform/actors)
- [Input Schema Specification](https://docs.apify.com/platform/actors/development/actor-definition/input-schema)

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
