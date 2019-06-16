# Credit Default Swap Search Engine

## Introduction

Credit Default Swap Search Engine is an efficient search engine based on RESTful APIs to allow you to search and navigate historical mentions of credit default swaps all the way from 2004 - 2017. One can simply search for any specific credit default swap that they are looking for by simply entering the name of the *counterparty* or the *reference entity*.

## Features

The search engine has quite a few other resources which have been described in detail below:

### Search Engine

Upon extracting information from both structured and unstructured formats of Credit Default Swap reportings, we developed a search engine to enable future research studies to further take advantage of the consolidated data that has been aggregated through rule-based as well as NLP techniques.
<br>
This web application was built on Flask with the entire dataset of 16,813 rows into an array of JSON objects. JSON objects are the defacto standard for query based searching and also allow swift query and return time. Furthermore, this web application also serves as a way for researchers and ﬁnancial analysts to upload reports that they want the Credit Default Swap information extracted from. The application itself is capable of extracting both structured as well as unstructured reporting of CDS as the model is running at the backend and is served as a RESTful framework.

### Named Entity Recognition


### Report Processing


### Probability of Default



## Requirements

<ul>
    <li>Python 3.7.3 64-bit</li>
    <li>Flask==1.0.2</li>
    <li>Jinja2==2.10</li>
    <li>json2html==1.2.1</li>
    <li>pandas==0.24.2</li>
</ul>

_More updates will follow with time_
