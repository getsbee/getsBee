/* eslint-disable no-undef */
import "./Content.css";
import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Spinner from "./Spinner"; // 스피너 컴포넌트 import
import Item from "./Item";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.REACT_APP_API_KEY,
  dangerouslyAllowBrowser: true, 
 });
const { Readability } = require("@mozilla/readability");

function Content({ isEnabled, HTMLContent, isLogin }) {
  const [textContents, setContent] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false); // 로딩 상태 초기값을 false로 설정
  const [error, setError] = useState(false);
  const apiKey = process.env.REACT_APP_API_KEY;
  const contentRef = useRef(null);
  const login = useRef(false);

  function htmlStringToDocument(htmlString) {
    const parser = new DOMParser();
    return parser.parseFromString(htmlString, "text/html");
  }

  function extractTextNodes(node) {

    const tmp = [];
    function traverse(currentNode) {
      if (currentNode.nodeType === Node.TEXT_NODE) {
        const parentElement = currentNode.parentNode;
        const sentencePattern = /(?<=[.!?])\s+/g;
        const textContent = currentNode.textContent.trim();

        const tagName = parentElement.tagName.toLowerCase();

        const isTargetTag =
          tagName === "p" ||
          tagName === "span" ||
          tagName === "div" ||
          tagName === "li" ||
          tagName === "article" ||
          tagName === "img";
        if (!isTargetTag) return;

        if (
          textContent &&
          textContent.length > 20 &&
          textContent.length <= 200
        ) {
          const sentences = textContent
            .split(sentencePattern)
            .map((sentence) => sentence.trim())
            .filter((sentence) => sentence.length > 0);

          let startIndex = 0;
          sentences.forEach((sentence) => {
            tmp.push(sentence);
          });
        }
      }

      if (currentNode.nodeType === Node.ELEMENT_NODE) {
        Array.from(currentNode.childNodes).forEach((child) => traverse(child));
      }
    }

    traverse(node);
    setContent(tmp);
  }

  async function extractMainContent(HTMLContent) {
    try {
      const doc = htmlStringToDocument(HTMLContent);
      const reader = new Readability(doc);

      const article = reader.parse();

      if (article) {
        return {
          text: article.textContent,
          node: htmlStringToDocument(article.content).body,
        };
      } else {
        return {
          text: "",
          node: "",
        };
      }
    } catch (error) {
      console.log(error);
      return {
        text: "",
        node: "",
      };
    }
  }

  useEffect(() => {
    extractMainContent(HTMLContent)
      .then((result) => {
        extractTextNodes(result.node);
      })
      .catch((err) => {console.log(err)});
  }, [HTMLContent]);


  async function run(model) {
    try {
      let prompt = `
      다음 문장 배열에서 중요하다고 생각되는 문장들을 배열형식으로 추천해 주세요. 다음 조건을 만족해야 합니다:
      1  그리고 꼭 배열의 크기가 5를 넘으면 안됩니다.
      2. JSON형식으로 보내주세요 예를 들어, [{"중요 문장1의 인덱스" : "중요 문장1"}, {"중요 문장2의 인덱스" : "중요 문장2"}, {"중요 문장3의 인덱스" : "중요 문장3"}] 형식으로 응답해 주세요.
      3. 전체적인 내용을 빠르게 파악할 수 있는 핵심 문장들을 추천해주세요, 기존 배열에서 순서에 맞게 제공해주어야 합니다. 
      4. 또한 기존 문장에서 문장을 추가하지말고 그냥 있는 그대로 중요 문장을 추출해주세요.
      
      예를 들어 [{0 : 중요문장1}, {5: 중요문장2}, {10: 중요문장3}, {13: 중요문장4}, {15: 중요문장5}] 이런 템플릿입니다.
      그리고 절대 문장 데이터를 변경해서는 안됩니다.
      전달받은 문장을 그대로 주세요
      `;

      if (textContents.length === 0) {
        setLoading(false);
        setErrorMessage("내용이 부족합니다.");
        setError(true);
        return;
      }

      const result1 = textContents.reduce((acc, item, index) => {
        acc[index] = item;
        return acc;
      }, {});
      prompt += JSON.stringify(result1);

      prompt+= " \n\n\n 어떠한 문구 없이 JSON형식 답만 줘 ";

      const chatCompletion = await getGroqChatCompletion(prompt);

      const text = chatCompletion.choices[0]?.message?.content || "";
      const regex = /(\{[^}]+\})/g; // `{}`로 감싸인 부분을 추출하는 정규식
      let match;
      const sentences = [];

      while ((match = regex.exec(text)) !== null) {
        sentences.push(JSON.parse(match[1])); // 전체 `{}` 부분을 배열에 추가
      }
      console.log(sentences);
      const sortedValues = sentences
        .sort((a, b) => Object.keys(a)[0] - Object.keys(b)[0])  // 숫자 기준으로 정렬
        .map(item => Object.values(item)[0]);  // 값만 추출
      console.log(sortedValues);
      setResult(sortedValues);

      chrome.runtime.sendMessage({
        type: "RECOMMEND_CLICKED",
        resultArr: sortedValues,
      });
    } catch (error) {
      console.log(error);
      setErrorMessage("요약 불가 포스트입니다");
      setError(true);
    }
    setLoading(false); // 응답을 받은 후 로딩 상태를 false로 설정
  }

  async function getGroqChatCompletion(prompt) {
    return groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });
  }

  // 추천 버튼 클릭 시 실행되는 함수
  const recommend = async () => {
    if (!isLogin) {
      window.open("https://getsbee.kr/about", "_blank");
      return;
    }

    setError(false); // 추천 요청 시작 시 에러 상태를 false로 초기화
    setLoading(true); // 추천 요청 시작 시 로딩 상태를 true로 설정
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    await run(model);
  };

  // 상태에 따른 렌더링을 처리하는 함수
  const renderContent = () => {
    if (loading) {
      return <Spinner />; // 로딩 상태일 때만 Spinner 컴포넌트를 표시
    }

    if (error) {
      return (
        <div className="error-container">
          <div className="error-message"> {errorMessage} </div>{" "}
        </div>
      );
    }
    if (result.length === 0) {
      return (
        <div className="buttonDiv">
          {!isEnabled ? (
            <>
              <span>해당 페이지의 핵심 문장을 GPT 추천 받아보세요.</span>
              <div className="button" onClick={recommend}>
                원클릭 핵심 문장 추천
              </div>
            </>
          ) : (
            <>
              <span>
                기능이 비활성화되었습니다. 로그인하여 활성화해 주세요.
              </span>
              <div
                className="button disabled"
                onClick={(e) => e.preventDefault()}
              >
                원클릭 핵심 문장 추천
              </div>
            </>
          )}
        </div>
      );
    }
    return result.map((idx) => <Item key={idx} content={idx} />);
  };

  return (
    <div className="content-container" ref={contentRef}>
      {" "}
      {renderContent()}{" "}
    </div>
  );
}

export default Content;
