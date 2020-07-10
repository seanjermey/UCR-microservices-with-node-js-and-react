import Document, { Html, Head, Main, NextScript } from "next/document";

class _Document extends Document {
  /**
   *
   * @param ctx
   */
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  /**
   *
   */
  render() {
    return (
      <Html>
        <Head />
        <body className={"bg-dark text-light"}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default _Document;
