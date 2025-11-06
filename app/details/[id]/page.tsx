"use client";

import { useState, useEffect } from "react";
import { Layout, Card, Row, Col, Divider, Spin, message } from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import Header from "@/components/Header";
import { placesApi } from "@/lib/api";
import type { Place } from "@/types";
import { use } from "react";

const { Content } = Layout;

export default function DetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setLoading(true);
        const response = await placesApi.getById(id);
        if (response.success && response.data) {
          setPlace(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch place:", error);
        message.error("Failed to load place details");
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id]);

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Header />
        <Content style={{ padding: "80px 20px", textAlign: "center" }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (!place) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Header />
        <Content style={{ padding: "80px 20px", textAlign: "center" }}>
          <h2>Газар олдсонгүй</h2>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />

      <Content>
        {/* Hero Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #f5a623 0%, #f7b731 100%)",
            padding: "50px 20px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              color: "#fff",
              fontSize: 42,
              fontWeight: "bold",
              marginBottom: 8,
            }}
          >
            Дэлгэрэнгүй
          </h1>
          <p style={{ color: "#fff", fontSize: 16, margin: 0 }}>
            Байгууллага, үйлчилгээ хайлтын систем
          </p>
        </div>

        {/* Main Content */}
        <div style={{ padding: "60px 50px", background: "#fff" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {/* Business Name */}
            <h2
              style={{
                fontSize: 32,
                fontWeight: "bold",
                marginBottom: 40,
                color: "#262626",
              }}
            >
              {place.name}
            </h2>

            <Row gutter={[32, 32]}>
              {/* Large Image */}
              <Col xs={24}>
                <div
                  style={{
                    width: "100%",
                    height: 450,
                    borderRadius: 8,
                    overflow: "hidden",
                    background:
                      "linear-gradient(135deg, #8b4513 0%, #a0522d 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Image placeholder - replace with actual image */}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundImage:
                        place.images && place.images.length > 0
                          ? `url(${place.images[0]})`
                          : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </div>
              </Col>

              {/* Business Details Card */}
              <Col xs={24}>
                <Card
                  style={{
                    borderRadius: 8,
                    border: "1px solid #f0f0f0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      marginBottom: 8,
                      color: "#262626",
                    }}
                  >
                    {place.name}
                  </h3>

                  <p
                    style={{
                      fontSize: 15,
                      color: "#595959",
                      marginBottom: 24,
                      lineHeight: 1.6,
                    }}
                  >
                    {place.description}
                  </p>

                  <Divider style={{ margin: "20px 0" }} />

                  {/* Contact Information */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        fontSize: 15,
                      }}
                    >
                      <EnvironmentOutlined
                        style={{ fontSize: 18, color: "#faad14" }}
                      />
                      <span style={{ color: "#595959" }}>{place.address}</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        fontSize: 15,
                      }}
                    >
                      <PhoneOutlined
                        style={{ fontSize: 18, color: "#faad14" }}
                      />
                      <span style={{ color: "#595959" }}>{place.phone}</span>
                    </div>

                    {place.email && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          fontSize: 15,
                        }}
                      >
                        <MailOutlined
                          style={{ fontSize: 18, color: "#faad14" }}
                        />
                        <span style={{ color: "#595959" }}>{place.email}</span>
                      </div>
                    )}

                    {place.website && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          fontSize: 15,
                        }}
                      >
                        <GlobalOutlined
                          style={{ fontSize: 18, color: "#faad14" }}
                        />
                        <a
                          href={place.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#1890ff" }}
                        >
                          {place.website}
                        </a>
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
