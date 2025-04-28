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
            buttonHolder = new Panel();
            settingsBTN = new Button();
            playBTN = new Button();
            topPanel.SuspendLayout();
            buttonHolder.SuspendLayout();
            SuspendLayout();
            // 
            // clientName
            // 
            clientName.Anchor = AnchorStyles.None;
            clientName.AutoSize = true;
            clientName.Font = new Font("Segoe UI", 36F, FontStyle.Regular, GraphicsUnit.Point);
            clientName.ForeColor = SystemColors.Control;
            clientName.Location = new Point(452, 49);
            clientName.Name = "clientName";
            clientName.Size = new Size(245, 65);
            clientName.TabIndex = 0;
            clientName.Text = "JINCLIENT";
            // 
            // topPanel
            // 
            topPanel.BackColor = Color.Black;
            topPanel.Controls.Add(clientName);
            topPanel.Dock = DockStyle.Top;
            topPanel.Location = new Point(0, 0);
            topPanel.Name = "topPanel";
            topPanel.Size = new Size(1184, 163);
            topPanel.TabIndex = 1;
            // 
            // buttonHolder
            // 
            buttonHolder.Controls.Add(settingsBTN);
            buttonHolder.Controls.Add(playBTN);
            buttonHolder.Location = new Point(403, 352);
            buttonHolder.Name = "buttonHolder";
            buttonHolder.Size = new Size(329, 66);
            buttonHolder.TabIndex = 2;
            // 
            // settingsBTN
            // 
            settingsBTN.BackgroundImage = Properties.Resources.settingsIcon;
            settingsBTN.BackgroundImageLayout = ImageLayout.Stretch;
            settingsBTN.Cursor = Cursors.Hand;
            settingsBTN.Location = new Point(266, 3);
            settingsBTN.Name = "settingsBTN";
            settingsBTN.Size = new Size(60, 60);
            settingsBTN.TabIndex = 1;
            settingsBTN.UseVisualStyleBackColor = true;
            settingsBTN.Click += settingsBTN_Click;
            // 
            // playBTN
            // 
            playBTN.Cursor = Cursors.Hand;
            playBTN.Location = new Point(3, 3);
            playBTN.Name = "playBTN";
            playBTN.Size = new Size(257, 60);
            playBTN.TabIndex = 0;
            playBTN.Text = "PLAY";
            playBTN.UseVisualStyleBackColor = true;
            playBTN.Click += playBTN_Click;
            // 
            // client
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackgroundImage = Properties.Resources.clientBG;
            BackgroundImageLayout = ImageLayout.Stretch;
            ClientSize = new Size(1184, 611);
            Controls.Add(buttonHolder);
            Controls.Add(topPanel);
            FormBorderStyle = FormBorderStyle.FixedDialog;
            MaximizeBox = false;
            Name = "client";
            Text = "JinClient";
            topPanel.ResumeLayout(false);
            topPanel.PerformLayout();
            buttonHolder.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        private Label clientName;
        private Panel topPanel;
        private Panel buttonHolder;
        private Button settingsBTN;
        private Button playBTN;
    }
}
