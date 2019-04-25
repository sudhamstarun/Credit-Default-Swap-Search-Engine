import pickle
import nltk


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


def align_data(data):
    """Given dict with lists, creates aligned strings

    Args:
        data: (dict) data["x"] = ["I", "love", "you"]
              (dict) data["y"] = ["O", "O", "O"]
    Returns:
        data_aligned: (dict) data_align["x"] = "I love you"
                           data_align["y"] = "O O    O  "
    """
    spacings = [max([len(seq[i]) for seq in data.values()])
                for i in range(len(data[list(data.keys())[1]]))]

    data_aligned = dict()

    # for each entry, create aligned string
    for key, seq in data.items():
        str_aligned = ""
        for token, spacing in zip(seq, spacings):
            str_aligned += token + " " * (spacing - len(token) + 1)

        data_aligned[key] = str_aligned

    return data_aligned


def model_api(input):
    text = nltk.word_tokenize(input)
    tagged_text = nltk.pos_tag(text)
    testing = sentence_features(tagged_text)
    crf_model = pickle.load(open('model/finalized_model.sav', 'rb'))
    y_pred = crf_model.predict_single(testing)
    print(y_pred)
    output_data = align_data({"input": input, "output": y_pred})

    return output_data
