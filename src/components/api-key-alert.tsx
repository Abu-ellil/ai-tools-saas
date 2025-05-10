"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExternalLink, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ApiKeyAlertProps {
  service: "openai" | "anthropic" | "stability" | "elevenlabs";
  className?: string;
}

export function ApiKeyAlert({ service, className }: ApiKeyAlertProps) {
  const serviceInfo = {
    openai: {
      name: "OpenAI",
      url: "https://platform.openai.com/api-keys",
      envVar: "OPENAI_API_KEY",
      description: "مطلوب للمحادثة الذكية وتوليد النصوص",
    },
    anthropic: {
      name: "Anthropic",
      url: "https://console.anthropic.com/",
      envVar: "ANTHROPIC_API_KEY",
      description: "مطلوب لنماذج Claude للمحادثة الذكية",
    },
    stability: {
      name: "Stability AI",
      url: "https://platform.stability.ai/account/keys",
      envVar: "STABILITY_API_KEY",
      description: "مطلوب لتوليد الصور",
    },
    elevenlabs: {
      name: "ElevenLabs",
      url: "https://elevenlabs.io/app/api-key",
      envVar: "ELEVENLABS_API_KEY",
      description: "مطلوب لتحويل النص إلى صوت",
    },
  };

  const info = serviceInfo[service];

  return (
    <Alert className={className} variant="warning">
      <AlertTitle className="flex items-center gap-2 text-amber-600">
        <AlertTriangle className="h-4 w-4" />
        مفتاح API غير صالح: {info.name}
      </AlertTitle>
      <AlertDescription className="mt-3">
        <p className="mb-2">
          لاستخدام {info.description}، يجب عليك إضافة مفتاح API صالح من{" "}
          {info.name} في ملف .env
        </p>
        <ol className="list-decimal list-inside space-y-2 mt-3 mb-3">
          <li>
            قم بإنشاء حساب على{" "}
            <Button variant="link" className="h-auto p-0" asChild>
              <Link
                href={info.url}
                target="_blank"
                className="inline-flex items-center"
              >
                {info.name} <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </li>
          <li>قم بإنشاء مفتاح API جديد</li>
          <li>
            افتح ملف <code className="bg-muted px-1 py-0.5 rounded">.env</code>{" "}
            في مشروعك
          </li>
          <li>
            قم بتحديث المتغير{" "}
            <code className="bg-muted px-1 py-0.5 rounded">{info.envVar}</code>{" "}
            بمفتاح API الخاص بك
          </li>
          <li>أعد تشغيل الخادم المحلي</li>
        </ol>
        <Button asChild className="mt-2">
          <Link
            href={info.url}
            target="_blank"
            className="inline-flex items-center"
          >
            الحصول على مفتاح API <ExternalLink className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
