"use client";

import { useState } from "react";
import { Modal, Form, Input, Select, Upload, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";

const { TextArea } = Input;
const { Option } = Select;

interface AddPlaceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddPlaceModal({
  open,
  onClose,
  onSuccess,
}: AddPlaceModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSubmit = async (values: {
    name: string;
    type: string;
    description: string;
    address: string;
    phone: string;
    email?: string;
    website?: string;
  }) => {
    setLoading(true);
    try {
      // Convert uploaded files to URLs (in real app, upload to cloud storage)
      const imageUrls = fileList.map((file) => file.url || file.thumbUrl || "");

      const placeData = {
        ...values,
        images: imageUrls.filter((url) => url !== ""),
      };

      const response = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(placeData),
      });

      const result = await response.json();

      if (result.success) {
        message.success("Амжилттай нэмэгдлээ!");
        form.resetFields();
        setFileList([]);
        onSuccess?.();
        onClose();
      } else {
        message.error(result.error || "Алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error adding place:", error);
      message.error("Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onClose();
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="mt-2">Зураг нэмэх</div>
    </div>
  );

  return (
    <Modal
      title="Байршил нэмэх"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-5"
      >
        <Form.Item
          label="Нэр"
          name="name"
          rules={[{ required: true, message: "Нэрээ оруулна уу!" }]}
        >
          <Input placeholder="Жишээ: Номин номын дэлгүүр" />
        </Form.Item>

        <Form.Item
          label="Төрөл"
          name="type"
          rules={[{ required: true, message: "Төрлөө сонгоно уу!" }]}
        >
          <Select placeholder="Төрөл сонгох">
            <Option value="restaurant">Ресторан</Option>
            <Option value="hotel">Зочид буудал</Option>
            <Option value="shop">Дэлгүүр</Option>
            <Option value="clinic">Эмнэлэг</Option>
            <Option value="service">Үйлчилгээ</Option>
            <Option value="other">Бусад</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Тайлбар"
          name="description"
          rules={[{ required: true, message: "Тайлбар оруулна уу!" }]}
        >
          <TextArea
            rows={3}
            placeholder="Байршлын тухай дэлгэрэнгүй мэдээлэл"
          />
        </Form.Item>

        <Form.Item
          label="Хаяг"
          name="address"
          rules={[{ required: true, message: "Хаяг оруулна уу!" }]}
        >
          <Input placeholder="Жишээ: Сүхбаатар дүүрэг, Сөүл гудамж" />
        </Form.Item>

        <Form.Item
          label="Утас"
          name="phone"
          rules={[{ required: true, message: "Утас оруулна уу!" }]}
        >
          <Input placeholder="+976 11 123456" />
        </Form.Item>

        <Form.Item label="Имэйл" name="email">
          <Input type="email" placeholder="info@example.com" />
        </Form.Item>

        <Form.Item label="Вэбсайт" name="website">
          <Input placeholder="https://example.com" />
        </Form.Item>

        <Form.Item label="Зураг">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
            beforeUpload={() => false}
            maxCount={5}
          >
            {fileList.length >= 5 ? null : uploadButton}
          </Upload>
          <div className="text-gray-500 text-xs mt-2">
            Тэмдэглэл: Одоогоор зураг URL-ээр хадгалагдана. Ирээдүйд cloud
            storage нэмэгдэнэ.
          </div>
        </Form.Item>

        <Form.Item>
          <div className="flex gap-2.5 justify-end">
            <Button onClick={handleCancel}>Болих</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Нэмэх
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
