import requests
import json
from groq import Groq

client = Groq(
    api_key="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",
)


def audit_transcript(transcript):
    print('before audit_transcript')
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"Please audit the following transcript and provide a report:\n\n{transcript}",
            }
        ],
        model="mixtral-8x7b-32768",
    )
    print('after audit_transcript')

    # print(chat_completion.choices[0].message.content)
    return chat_completion.choices[0].message.content