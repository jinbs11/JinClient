using System;
using System.Drawing;
using System.Windows.Forms;

namespace client
{
    public partial class client : Form
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        private void InitializeComponent()
        {
            clientName = new Label();
            topPanel = new Panel();
            topPanel.SuspendLayout();
            SuspendLayout();
            // 
            // clientName
            // 
            clientName.Anchor = AnchorStyles.None;
            clientName.AutoSize = true;
            clientName.Font = new Font("Segoe UI", 36F, FontStyle.Regular, GraphicsUnit.Point);
            clientName.Location = new Point(452, 49);
            clientName.Name = "clientName";
            clientName.Size = new Size(245, 65);
            clientName.TabIndex = 0;
            clientName.Text = "JINCLIENT";
            // 
            // topPanel
            // 
            topPanel.Controls.Add(clientName);
            topPanel.Dock = DockStyle.Top;
            topPanel.Location = new Point(0, 0);
            topPanel.Name = "topPanel";
            topPanel.Size = new Size(1184, 163);
            topPanel.TabIndex = 1;
            // 
            // client
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackgroundImage = Properties.Resources.clientBG;
            BackgroundImageLayout = ImageLayout.Stretch;
            ClientSize = new Size(1184, 611);
            Controls.Add(topPanel);
            FormBorderStyle = FormBorderStyle.FixedDialog;
            MaximizeBox = false;
            Name = "client";
            Text = "JinClient";
            topPanel.ResumeLayout(false);
            topPanel.PerformLayout();
            ResumeLayout(false);
        }

        #endregion

        private Label clientName;
        private Panel topPanel;
    }
}
