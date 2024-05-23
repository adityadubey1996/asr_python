import requests
import json
from groq import Groq
from langchain import PromptTemplate
from langchain.chains.summarize import load_summarize_chain
from langchain_groq import ChatGroq
from langchain.docstore.document import Document

class AuditTranscript:
    def __init__(self, groq_api_key, model_name="mixtral-8x7b-32768", temperature=0):
        self.llm = ChatGroq(temperature=temperature, groq_api_key=groq_api_key, model_name=model_name)

    def get_refine_audit_response(self, transcript):
        doc_transcript = [Document(page_content=t) for t in transcript]

        prompt_template = """Write a concise summary of the following:
        {text}
        CONCISE SUMMARY:"""
        prompt = PromptTemplate.from_template(prompt_template)

        refine_template = (
            "Your job is to produce a final summary\n"
            "We have provided an existing summary up to a certain point: {existing_answer}\n"
            "We have the opportunity to refine the existing summary"
            "(only if needed) with some more context below.\n"
            "------------\n"
            "{text}\n"
            "------------\n"
            "Given the new context, refine the original summary"
            "If the context isn't useful, return the original summary."
        )
        refine_prompt = PromptTemplate.from_template(refine_template)
        chain = load_summarize_chain(
            llm=self.llm,
            chain_type="refine",
            question_prompt=prompt,
            refine_prompt=refine_prompt,
            return_intermediate_steps=True,
            input_key="input_documents",
            output_key="output_text",
        )
        result = chain({"input_documents": doc_transcript}, return_only_outputs=True)

        return result

if __name__ == '__main__':
    sample_transcript = [
        """In the 1980s, American Airlines and its then president Robert Crandall started a revolution in airline pricing. Crandall is famous for many airline innovations in use today, such as devising the first frequent flier program and contributing to route optimization and central reservation system adoption. But he also pioneered yield management -- the set of price optimization strategies that preceded revenue management.

By offering cheaper rates to passengers who book earlier, providing seat reservation at a higher price, and incorporating the now controversial practice of overbooking, Crandall's AA claimed to generate an extra $500 million a year. The economic impact of yield management strategies utilized by American Airlines is apparent.

Today, revenue management specialists and systems work at most airlines to sell the right product to the right customer at the right moment at the right price on the right distribution channel. (Revenue management strategies in hotels are also common.) One of the critical components of revenue management is dynamic pricing. Let's talk about the current methods of dynamic pricing and how the techniques are maturing to match the current airline distribution market.""",
        """Traditionally and most commonly, airlines have been using static pricing. An airline creates its fare structure using a limited number of price points based on reservation booking designators (RBD) and then published through ATPCO. Each price point is developed for a specific customer segment and demand situation.

Namely, there are price-sensitive passengers who are not locked in on a date or schedule and will pick the cheapest fare regardless of long layovers. Others must reach a destination on time and will pay any price to travel on a specific day. Considering such factors as time of flight and time of purchase, sales channel, and seat class, airlines create price points for different passenger segments.

This segmentation, though, remains fairly shallow. Without understanding the competitive landscape, market conditions, distribution of fares, and more complex data that can be received only through analytics, airlines can't effectively segment passengers beyond the typical "business or leisure" scenario. This is especially important for low-cost carriers that need more sophisticated and creative solutions to stay competitive and profitable.

Today, thanks to data-driven capabilities and technology advancements, revenue management strategies for airlines have evolved to consider tons of various criteria in real time and deliver truly personalized pricing, which we know today as dynamic.""",
        """You will notice that these problems are interdependent and there are common solutions to them since the industry is on the road to change how airlines create and price offers to customers.
Legacy revenue management technology
The four-decade long history of revenue management practices in airlines is both a gift and a curse. Ancient, rule-based software lags not only in technical finesse, but also in keeping up with new distribution trends.

The first problem is applying old approaches to solving one of the main tasks in RM -- demand forecasting. IT systems need to access many data sources and employ algorithms to pinpoint demand signals in real time, which requires some sophisticated data analytics and machine learning capabilities.

The second limitation stems from relying on traditional distribution models that keep airlines from using precious data from external sources. As long as airlines have limited control over the offer construction on indirect channels (GDSs and aggregators), they can't deliver truly personalized experiences.
Fare compression
An airline's ability to price flights is restricted by legacy distribution mechanisms. For once, airlines can offer a limited number of price points based on reservation booking designators (RBD) and when publishing them through ATPCO, they can update prices only in specific intervals. Consequently, prices are not adjusted in real time. This leads to other problems, like uncertain net revenue as airlines often file different fare products under the same RBD.
Little consideration for ancillary pricing
Ancillary revenues bring the industry around $55 billion a year and have been on the rise for the past ten years, being a huge part of low-cost carriers' profits. Yet base flight products and ancillary products are managed in separate processes and through separate IT systems (revenue management and merchandising systems).

So, extra baggage, seat selection, meals, Internet access, and many more services are priced statically and not accounted for in revenue management implementation. Customers receive the same price for the same product and the shopping process doesn't consider contextual customer information. Basically, there's no personalization.

Industry leaders such as IATA, ATPCO, Amadeus, Sabre, Lufthansa, and others are collaborating on solving the aforementioned problems and their research has culminated in the new airline distribution approach called continuous pricing. Let's look at it in detail."""
    ]

    audit_transcript_instance = AuditTranscript(groq_api_key="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")
    result = audit_transcript_instance.get_refine_audit_response(sample_transcript)

    for intermediate_steps in result['intermediate_steps']:
        print(intermediate_steps)
        print("--------------------------")

    print(result['output_text'])
