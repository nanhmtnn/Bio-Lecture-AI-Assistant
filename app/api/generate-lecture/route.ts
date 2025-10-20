import { NextResponse } from "next/server";
import { ai } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    // const { bigTopic, subtopics, outputMode } = await req.json();

    // if (!bigTopic) {
    //   return NextResponse.json({ error: "Missing topic" }, { status: 400 });
    // }

    // Try to make it work -----------------
    const { bigTopic, outputMode } = await req.json();

    if (!bigTopic?.trim()) {
      return NextResponse.json(
        { error: "Topic is required" }, 
        { status: 400 }
      );
    }

    // Validate input length
    if (bigTopic.length > 200) {
      return NextResponse.json(
        { error: "Topic too long. Maximum 200 characters." },
        { status: 400 }
      );
    }

    // ------------------------------------


//     const prompt = `
// Role:
// You are a highly experienced Cell & Molecular Biology professor at a top-tier university.
// Goal:
// Generate a comprehensive, beginner-friendly lecture and study guide that teaches a student with no prior biology background about ${bigTopic}, and return the response strictly in valid JSON format.

// Primary Instructions (JSON-Ready)
// Output must be valid JSON structured exactly as shown below.
// ***IMPORTANT: For the fields "definition_and_purpose", "lecture_content", "molecular_structures_and_processes", and the items in "examples_and_applications", "common_misconceptions", and "student_activities", use full Markdown syntax (like **bold**, ## headers, and bullet lists using *) within the string values to ensure rich, readable formatting. All other string fields should remain plain text.***

// Required JSON Schema
// {
//   "title": "string",
//   "introduction": "string",
//   "big_topic": "string",
//   "identified_subtopics": [
//     {
//       "subtopic_title": "string",
//       "subtopic_role": "string"
//     }
//   ],
//   "lectures": [
//     {
//       "title": "string",
//       "estimated_study_time": "string (e.g. '60 minutes')",
//       "audience_level": "Beginner | Intermediate | Advanced",
//       "learning_objectives": ["string", "string", "string"],
//       "definition_and_purpose": "string (MUST contain Markdown formatting for readability)",
//       "lecture_content": "string (MUST contain detailed Markdown formatting for readability, including sub-headings and lists for mechanisms, steps, and significance)",
//       "molecular_structures_and_processes": "string (MUST contain Markdown formatting)",
//       "visual_aid_suggestions": [
//         {
//           "description": "string",
//           "ascii_diagram": "string (optional, Markdown code block if present)"
//         }
//       ],
//       "examples_and_applications": ["string (MUST contain Markdown formatting)", "string (MUST contain Markdown formatting)"],
//       "common_misconceptions": ["string (MUST contain Markdown formatting)", "string (MUST contain Markdown formatting)"],
//       "student_activities": ["string (MUST contain Markdown formatting)", "string (MUST contain Markdown formatting)"],
//       "key_terms": [
//         {
//           "term": "string",
//           "definition": "string",
//           "role": "string"
//         }
//       ],
//       "summary": ["string", "string"],
//       "quick_check_quiz": {
//         "questions": [
//           {
//             "question": "string",
//             "choices": ["string", "string", "string", "string"],
//             "answer": "string",
//             "explanation": "string"
//           }
//         ]
//       }
//     }
//   ],
//   "final_integrated_summary": {
//     "summary_points": ["string", "string"],
//     "study_plan_and_resources": {
//       "textbooks": ["string"],
//       "review_articles": ["string"],
//       "online_tools_or_simulations": ["string"]
//     }
//   },
//   "terminology_and_concepts": [
//     {
//       "term": "string",
//       "definition": "string",
//       "function_or_role": "string",
//       "visual_analogy": "string (optional)"
//     }
//   ],
//   "output_mode": "concise" | "standard" | "expanded"
// }

// Generation Logic
// If subtopics are provided (${subtopics || "none"}):
// Generate one lecture object per subtopic in the lectures array.
// Include all subsections listed in the JSON schema above.
// If only ${bigTopic} is provided:
// Identify 4–8 essential subtopics and list them in "identified_subtopics".
// Generate full lectures for each identified subtopic (as in step 1).
// Conclude with "final_integrated_summary" that connects all subtopics.
// Always include:
// "terminology_and_concepts" covering key biological terms across the lectures.
// "final_integrated_summary" synthesizing understanding of the big topic.
// "study_plan_and_resources" recommending textbooks, review articles, and simulations.

// Tone, Style, and Depth Requirements
// Accessible to beginners; all terms explained clearly before or after first use.
// Use analogies and visual descriptions to make complex mechanisms intuitive.
// Include deeper "advanced notes" in parentheses for learners seeking more depth.
// All descriptions must be scientifically accurate and clearly structured.
// Use short paragraphs and lists; avoid dense walls of text.

// Usability Enhancements
// When requested, support these output-length modes:
// Mode    Description
// "concise"   1-page summary per subtopic
// "standard"  Default structure above
// "expanded"  Adds detailed technical notes, suggested readings, and problem sets with answers
// Include "output_mode": "${outputMode}" at the root of the JSON.

// Final Instruction
// Now generate the guide for this project using the variables above and return only a single JSON object that conforms to the schema. No explanations, Markdown, or code fences—just valid JSON.
// `;

const prompt = `
Role:
You are a highly experienced Cell & Molecular Biology professor at a top-tier university.

Goal:
Generate a clear, beginner-friendly lecture and study guide about **${bigTopic}** for students with no prior biology background. 
The response must be a single, fully valid JSON object that exactly follows the schema below.

JSON Output Requirements:
- Return only valid JSON (no Markdown fences, no explanations, no extra text before or after).
- Use double quotes for all strings.
- Escape any internal quotes properly.
- Do not include trailing commas or comments.
- Every field shown in the schema must appear, even if empty arrays or strings are used.
- Only include values that can be parsed by JSON.parse() in JavaScript.

Simplified JSON Schema:
{
  "title": "string",
  "introduction": "string",
  "big_topic": "string",
  "identified_subtopics": [
    {
      "subtopic_title": "string",
      "subtopic_role": "string"
    },
    ...
  ],
  "lectures": [
    {
      "title": "string",
      "estimated_study_time": "string (e.g. '45 minutes')",
      "audience_level": "Beginner | Intermediate | Advanced",
      "learning_objectives": ["string", "string", "string"],
      "definition_and_purpose": "string (plain text, no Markdown)",
      "lecture_content": "string (clear, structured explanation in plain text)",
      "molecular_structures_and_processes": "string (plain text)",
      "examples_and_applications": ["string", "string"],
      "common_misconceptions": ["string", "string"],
      "student_activities": ["string", "string"],
      "key_terms": [
        {
          "term": "string",
          "definition": "string",
          "role": "string"
        }
      ],
      "summary": ["string", "string"],
      "quick_check_quiz": {
        "questions": [
          {
            "question": "string",
            "choices": ["string", "string", "string", "string"],
            "answer": "string",
            "explanation": "string"
          }
        ]
      }
    },
    ...
  ],
  "final_integrated_summary": {
    "summary_points": ["string", "string"],
    "study_plan_and_resources": {
      "textbooks": ["string"],
      "review_articles": ["string"],
      "online_tools_or_simulations": ["string"]
    }
  },
  "terminology_and_concepts": [
    {
      "term": "string",
      "definition": "string",
      "function_or_role": "string"
    }
  ],
  "output_mode": "concise" | "standard"
}

Generation Logic:
1. Identify **2–3 essential subtopics** within ${bigTopic} and fill them under "identified_subtopics".
2. Create one lecture object per subtopic in "lectures" following the schema above.
3. Ensure all fields are filled with realistic, informative content.
4. The "final_integrated_summary" must connect the subtopics and provide a short study plan.
5. The "terminology_and_concepts" list should include 3–6 key biological terms with definitions and functions.
6. The "output_mode" field must be set to "${outputMode}".

Tone and Style:
- Accessible for complete beginners.
- Clear, scientifically accurate, and engaging.
- Avoid Markdown or HTML formatting; use plain text and lists within strings only if natural.

Final Instruction:
Return only the JSON object that conforms to the schema above — no explanations, no additional commentary, and no code fences.
`;


    const response: any = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text: string;
    if (typeof response?.text === "function") {
      text = response.text();
    } else {
      text = response?.text ?? "";
    }

    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    let json;
    try {
      json = JSON.parse(cleaned);
    } catch {
      json = { raw_output: cleaned, warning: "Response not valid JSON" };
    }

    return NextResponse.json(json);
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}