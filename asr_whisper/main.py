sample = "/Users/tnluser/Documents/github_doc/asr_python/4720171d-5d64-4891-a165-9e79b76baa52.wav"
# result = pipe(sample)
# print(result["text"])

from utils.audio_utils import convert_video_to_audio
from utils.transcription import transcribe_audio
from utils.audit import audit_transcript
import os

def main():
    # input_file = input("Enter the path to the audio/video file: ")
    # file_ext = os.path.splitext(input_file)[1].lower()

    # if file_ext in [".mp3", ".wav", ".flac"]:
    #     audio_file = input_file
    # elif file_ext in [".mp4", ".mov", ".avi"]:
    #     audio_file = os.path.splitext(input_file)[0] + ".wav"
    #     convert_video_to_audio(input_file, audio_file)
    # else:
    #     print("Unsupported file format. Please provide an audio or video file.")
    #     return
    audio_file = sample
    # transcript = transcribe_audio(audio_file)

    transcript = """
नौ इन सभी टॉपिक्स को डिस्क्रेशन करने के बाद comes our last and final topic that is in regards to a mentor most of the time क्या होता है बच्चों की studies पे या तो दोनों parent ध्यान नहीं दे पाते हैं या तो कोई एक parent ऐसा होता है जो कि उतना educated नहीं होता है कि वो बच्चे को अच्छी तरह से guidance प्रोवाइड कर सकता है so to make all these things successful what we are gonna do कि रवी को उसकी studies में उसका ध्यान रखने के लिए एक personal mentor हम प्रोवाइड करेंगे जो सुबा 10 वज़े से लेके रात के 8 वज़े तक रवी की studies का ध्यान रखेगा चेक करेगा कि आज रवी ने math पढ़ा science पढ़ा social study पढ़ा या फिर English पढ़ा कितनी चीजे रवी को समझ में आई कितनी चीजे रवी को समझ में नहीं आई let's suppose कि रवी ने आज math पढ़ा but math में उसने पढ़ा division के बारे में तो ये mentor चेक करेगा कि जो division का concept था वो रवी को समझ में आया है या फिर नहीं आया है अगर आया है तो कितने percent समझना है और एक proper report create करके ये रोज रात आपको Mr. Amit share किया गए ताकि आपको proper idea रहे कि आपके बच्चे ने आज क्या पढ़ा कितना समझ में आया है कितना समझ में नहीं आया है ताकि आप भी properly guide करता है vaguely guide ना करें proper एक point को उठा के guide करता है इसी के साथ में ये जो personal mentor रहेगा रवी कभी भी call करके इनसे अपने सारे के सारे doubts discuss कर सकते हैं study को लेके जो भी आपने schedule बनाना हुआ उन चीज़ों के regarding आप discuss कर सकते हैं इनसे properly और ये आपकी बच्ची के studies का ध्यान करते हैं इसी के साथ में what we are gonna do after a single week for 5 to 10 minutes मिलने का कोशिश किया करेंगे जिसमें discussion किया करेंगे कि last week रवी का performance कैसा रहा है कितनी चीज़ें उसको समझ में आये कितनी चीज़ें समझ में नहीं आये कितना interest उसका studies में develop हो पाया जो हमने study plan develop किया है क्या उस study plan को वो properly follow पर पा रहा है नहीं कर पा रहा है उसका benefit हो रहा है उसकी growth हो रही है regularly या फिर नहीं हो पा रही है तो अगर लगेगा कि everything is going on track तो हम उस plan को करेंगे continue लगेगा कि कुछ हारी है problem तो अगले ही week उस plan को करेंगे हम change और लगेगा कि उस plan से कुछ benefit नहीं हो रहा है तो उस plan को कर देंगे हम तो now I just wanna know it from your end Mr. Amit तू teachers एक India का top teacher और एक personal attention देने वाला teacher मिलके अगर एट student की class में आपके बच्चे को teach करें और movies के way में teach करें और interest के लिए teach करें और एक personal mentor दें जो उसकी studies का ध्यान रखें तो ये सारी चीज़े करने के बाद क्या रभी studies में और जदा better हो पाएगा पहले के comparison में या नहीं हो पाएगा हो पाएगा sir या studies उसके लिए और जदा easy होगी या नहीं होगी easy हो जाएगी sir interest develop होगा नहीं होगा होगा sir base build होगा या नहीं होगा होगा sir तो मुझे बताएं कि अगर इस तरह से हम उसको पढ़ाएं तो आने वाले time पे अब रभी आपको एक architect engineer या फिर doctor बनता हुआ दिख पा रहा है और एक successful doctor बनता हुआ दिख पा रहा है या नहीं दिख रहा है sir tell me this really mr. abhi अगर आपको sir lkg class से इसी same structure से पढ़ा गया होता आज के time पे क्या आप एक बहुत ज़ादा better position पे पहुंच सकते थे या नहीं पहुंच सकते आपका जो knowledge होना था वो और ज़ादा increased होता या नहीं होता sir इसी same तरह से इसी same तरह से अगर रभी को lkg class से पढ़ा गया होता तो मुझे बताएं कि वो जो चोटा सामने test लिया क्या उसमें 2 plus 2 divided by 2 जैसे simple question का answer अभी नहीं कर पाता है कर लेता है यही missing है आज के time पे studies में कि teachers के बास बच्चे बहुत सारे हैं हर एक बच्चे के उपर ध्यान नहीं दे पाते हैं सब बच्चे का पढ़ने का तरीका different है हर बच्चों को उनके पढ़ने के तरीके से हम teach नहीं कर पा रहे हैं कभी पता नहीं लग पाता है कि बच्चे ने ये चीज समझी है या इस चीज को redline कभी पता नहीं लग पाता है कि बच्चे school में जाके सिर्फ number ले कर आ पा रहा है या knowledge बने कर आ पा रहा है कभी पता नहीं लग पाता है कि आज जो आपके बच्चे ने स्कूल में चीज पड़ी वो चीज उसको समझ में भी आई है नहीं आई है तो इन चीजों की हाल्प से आप इन हर एक चीज को ट्रैक कर पाएंगे आपको पता होगा कि डेली आपका बच्चा क्या पढ़ रहा है कहां पर गाइडेंस का रिक्वार्मेंट है जो टीचर उसको टीच कर रहे होंगे वो डेली के डेली उसको वो टॉपिक समझ के उसका एक
"""
    audit_report = audit_transcript(transcript)

    print("\nTranscript:")
    print(transcript)
    print("\nAudit Report:")
    print(audit_report)

if __name__ == "__main__":
    main()