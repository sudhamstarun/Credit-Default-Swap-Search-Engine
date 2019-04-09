import pickle
import nltk


def get_model_api(input):
    """Returns lambda function for api"""

    def extractWordFeatures(sentence, iterator):
    POS = sentence[iterator][1]
    Token = sentence[iterator][0]

    # Aggregating a feuature dicitonary based on the features of the current POS and word

    featureDict = {"POS[:2]": POS[:2],
                   "POS": POS,
                   "Token.isdigit()": Token.isdigit(),
                   "Token.istitle()": Token.istitle(),
                   "Token.isupper()": Token.isupper(),
                   "Token[-2:]": Token[-2:],
                   "Token[-3:]": Token[-3:],
                   "Token.lower()": Token.lower(),
                   "bias": 1.0,
                   }

    if iterator > 1:
        previousWord = sentence[iterator-1][0]
        previousPosTag = sentence[iterator-1][1]

        # Add characteristics of the sentence's previous word and POS to the feature dictionary
        featureDict.update({"-1:Token.lower()": previousWord.lower(),
                            "-1:Token.istitle()": previousWord.istitle(),
                            "-1:Token.isupper()": previousWord.isupper(),
                            "-1:POS": previousPosTag,
                            "-1:POS[:2]": previousPosTag[:2],
                            })

    # Add "Beginning of Sentence" at the start of the dictionary
    else:
        featureDict["BOS"] = True

    if iterator < len(sentence)-1:
        nextWord = sentence[iterator+1][0]
        nextPos = sentence[iterator+1][1]
        # Add characteristics of the sentence's previous next and POS to the feature dictionary
        featureDict.update({"+1:Token.lower()": nextWord.lower(),
                            "+1:Token.istitle()": nextWord.istitle(),
                            "+1:Token.isupper()": nextWord.isupper(),
                            "+1:POS": nextPos,
                            "+1:POS[:2]": nextPos[:2],
                            })

    else:
        featureDict["EOS"] = True

    return featureDict

    def sentence_features(sentence):
        return [extractWordFeatures(sentence, iterator) for iterator in range(len(sentence))]

    crf_model = pickle.load(open('finalized_model.sav', 'rb'))

    def model_api():
        text = nltk.word_tokenize(input)
        tagged_text = nltk.pos_tag(text)
        testing = sentence_features(tagged_text)
        y_pred = crf_model.predict_single(testing)

        output_data = align_data({"input": input, "output": y_pred})

        return output_data
