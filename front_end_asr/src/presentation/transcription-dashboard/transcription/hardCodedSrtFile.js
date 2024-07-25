function parseSRT(data) {
    data = data.replace(/\r/g, '');

    const regex = /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]*?)(?=\n\n|\n*$)/g;
    let result = [];
    let match;

    while ((match = regex.exec(data)) !== null) {
        result.push({
            id: parseInt(match[1], 10),
            start: match[2].replace(',', '.'),
            end: match[3].replace(',', '.'),
            text: match[4].trim().replace(/\n/g, ' ')
        });
    }

    return result;
  }

  export default parseSRT