import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const resourceName = searchParams.get("name");
  if (!resourceName) {
    return NextResponse.json({ error: "资源名称不能为空" }, { status: 400 });
  }

  const resourceUrl = `https://memos.cattk.com/api/v1/resources/${resourceName}`; // 需确认实际端点

  try {
    const response = await fetch(resourceUrl, { cache: "force-cache" });
    if (!response.ok) {
      throw new Error("获取资源失败");
    }
    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error("获取资源错误:", error);
    return NextResponse.json({ error: "获取资源失败" }, { status: 500 });
  }
}